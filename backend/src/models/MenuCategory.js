// models/menuCategory.js
import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },

  description: String,
  imageUrl: String,
  displayOrder: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },

  // Optional: For menu item organization
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuCategory'
  },

  // For featured or special categories
  isFeatured: { 
    type: Boolean, 
    default: false 
  },

  // For filtering (e.g., dietary preferences)
  tags: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'gluten-free', 'spicy', 'beverage', 'alcoholic']
  }],
  // For future use (e.g., category-specific settings)
  metadata: mongoose.Schema.Types.Mixed
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for menu items in this category
menuCategorySchema.virtual('items', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'category'
});

// Index for better performance
menuCategorySchema.index({ name: 1, isActive: 1 });

export default mongoose.models.MenuCategory || mongoose.model('MenuCategory', menuCategorySchema);