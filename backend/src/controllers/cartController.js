const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');

// Get cart
exports.getCart = async (req, res) => {
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
exports.addToCart = async (req, res) => {
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
    cart.deliveryFee = settings?.delivery.fee || 5;

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemIndex, quantity } = req.body;

    const cart = await Cart.findOne({ customer: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(400).json({ error: 'Invalid item index' });
    }

    const item = cart.items[itemIndex];
    const menuItem = await MenuItem.findById(item.menuItem);

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity and recalculate subtotal
      const pricePerUnit = item.price;
      const addOnsTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
      const unitTotal = pricePerUnit + addOnsTotal;
      
      item.quantity = quantity;
      item.subtotal = unitTotal * quantity;
    }

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
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
exports.clearCart = async (req, res) => {
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
