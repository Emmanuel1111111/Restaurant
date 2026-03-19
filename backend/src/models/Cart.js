import Users from "../models/Users.js";  
import mongoose from 'mongoose';
 

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',        
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedAddOns: [{        
    name: String,
    price: Number
  }],
  subtotal: {
    type: Number,
    default: 0
  }
});

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',            
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  deliveryFee: {
    type: Number,
    default: 5.00
  },
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0) + this.deliveryFee;
  next();
});

export default mongoose.model('Cart', cartSchema);