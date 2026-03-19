import { log } from 'console';
import Cart from '../models/Cart.js';
import  MenuItem from '../models/menuItem.js';
import Settings from '../models/settings.js';

// Get cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.userId })
      .populate('items.menuItem', 'name image price addOns');

    if (!cart) {
      
      cart = new Cart({ customer: req.userId, items: [] });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};
// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity, selectedAddOns } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Get menu item
    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem || !menuItem.isAvailable) {
      return res.status(400).json({ 
        error: menuItem ? 'Item is not available' : 'Menu item not found' 
      });
    }

    // Calculate item subtotal
    let itemSubtotal = menuItem.price * quantity;

    if (selectedAddOns?.length > 0) {
      selectedAddOns.forEach(addOn => {
        const menuAddOn = menuItem.addOns.find(a => a.name === addOn.name);
        if (menuAddOn) {
          itemSubtotal += menuAddOn.price * quantity;
        }
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ customer: req.userId });

    if (!cart) {
      cart = new Cart({ customer: req.userId, items: [] });
    }

    // Check if item already exists with same addOns
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.menuItem.toString() === menuItemId &&
        JSON.stringify(item.addOns) === JSON.stringify(selectedAddOns || [])
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal += itemSubtotal;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        addOns: selectedAddOns || [],
        subtotal: itemSubtotal,
      });
    }

    // Get delivery fee from settings
    const settings = await Settings.findOne();
    cart.deliveryFee = settings?.delivery || 5;

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { itemIndex, quantity } = req.body;

    // Validate required fields
    if (itemIndex === undefined || itemIndex === null) {
      return res.status(400).json({ error: 'Item index is required' });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    // Find cart and populate menu items
    const cart = await Cart.findOne({ customer: req.userId })
      .populate('items.menuItem');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Validate item index
    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(400).json({ 
        error: 'Invalid item index',
        details: `Index ${itemIndex} is out of range. Cart has ${cart.items.length} items.`
      });
    }

    // Get the item to update
    const item = cart.items[itemIndex];

    // Handle item removal (quantity <= 0)
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
      
      // Recalculate total
      const itemsSubtotal = cart.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      cart.total = itemsSubtotal + (cart.deliveryFee || 0);
      
      await cart.save();
      
      return res.json({ 
        success: true, 
        message: 'Item removed from cart',
        cart 
      });
    }

    // Get menu item details
    let menuItem = item.menuItem;

    // If menuItem is not populated (just an ID), fetch it
    if (!menuItem._id) {
      menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
    }

    // Validate menu item price
    const basePrice = Number(menuItem.price);
    
    if (!menuItem.price || isNaN(basePrice)) {
      return res.status(500).json({ 
        error: 'Invalid menu item price',
        details: 'Menu item has invalid or missing price'
      });
    }

    // Calculate add-ons total with validation
    const addOnsTotal = (item.addOns || []).reduce((sum, addon) => {
      const addonPrice = Number(addon.price);
      
      if (!addon.price || isNaN(addonPrice)) {
        return sum;
      }
      
      return sum + addonPrice;
    }, 0);

    // Calculate unit total and subtotal
    const unitTotal = basePrice + addOnsTotal;
    const newSubtotal = unitTotal * quantity;

    // Validate final calculation
    if (isNaN(newSubtotal)) {
      return res.status(500).json({ 
        error: 'Price calculation failed',
        details: 'Subtotal calculation resulted in NaN'
      });
    }

    // Update item
    item.quantity = quantity;
    item.subtotal = newSubtotal;

    // Recalculate cart total
    const itemsSubtotal = cart.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    cart.total = itemsSubtotal + (cart.deliveryFee || 0);

    // Save cart
    await cart.save();

    res.json({ 
      success: true, 
      message: 'Cart item updated successfully',
      cart,
      updated: {
        itemIndex,
        quantity,
        subtotal: newSubtotal
      }
    });

  } catch (error) {
    console.error('Update Cart Item Error:', error);
    
    res.status(500).json({ 
      error: 'Failed to update cart item',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemIndex } = req.body;

    const cart = await Cart.findOne({ customer: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }


    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(400).json({ error: 'Invalid item index' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
