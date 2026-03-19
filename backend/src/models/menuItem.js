import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },

 category: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'MenuCategory',
  required: true 
},
  imageUrl: String,
  isAvailable: { type: Boolean, default: true },
  ingredients: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  addOns: [{
    name: String,
    price: Number
  }],
  preparationTime: Number, // in minutes
  isVegan: { type: Boolean, default: false },
  isVegetarian: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);