import MenuItem from '../models/menuItem.js';
import MenuCategory from '../models/MenuCategory.js';

// Get all categories with items
 export const getMenu = async (req, res) => {
  try {
    const categories = await MenuCategory.find({ isActive: true })
      .sort({ displayOrder: 1 });
    
    const menu = await Promise.all(
      categories.map(async (category) => {
        const items = await MenuItem.find({
          category: category._id,
          isAvailable: true,
        }).sort({ name: 1 });

        return {
          id: category._id,
          name: category.name,
          description: category.description,
          items: items.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            addOns: item.addOns,
            isPopular: item.isPopular,
          })),
        };
      })
    );

    res.json({ success: true, menu });
  } catch (error) {
    console.error('Get Menu Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

// Get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate('category', 'name');

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
      
    }
    res.json({ success: true, item });
  } catch (error) {
    console.error('Get Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

// Search menu items
export const searchMenu = async (req, res) => {
  try {
    // Get search term from body OR query params
    const searchTerm = req.body.name || req.body.q || req.query.q;

    // Validate search term
    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({ 
        error: 'Search query is required',
        details: 'Please provide a search term'
      });
    }

    // Search menu items
    const items = await MenuItem.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ],
      isAvailable: true
    }).populate('category', 'name');

    res.json({ 
      success: true, 
      count: items.length,
      items 
    });

  } catch (error) {
    console.error('Search Menu Error:', error);
    res.status(500).json({ error: 'Failed to search menu' });
  }
};

// ===== STAFF ONLY =====

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;

    const category = new MenuCategory({
      name,
      description,
      displayOrder,
    });

    await category.save();
    

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;

    const category = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, displayOrder, isActive, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await MenuCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete all items in this category
    await MenuItem.deleteMany({ category: req.params.id });
 
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const { categoryId, name, description, price, image, addOns } = req.body;

    const item = new MenuItem({
      category: categoryId,
      name,
      description,
      price,
      image,
      addOns,
    });

    await item.save();

    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error('Create Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, addOns, isAvailable } = req.body;

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, addOns, isAvailable, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error('Update Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete Menu Item Error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

// Toggle item availability
export const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    item.isAvailable = !item.isAvailable;
    item.updatedAt = Date.now();
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    console.error('Toggle Availability Error:', error);
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
};
