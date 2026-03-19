import mongoose from 'mongoose';

export const orderItemSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  menuItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem',
    required: true 
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  addOns: [{
    name: String,
    price: Number
  }],
  specialInstructions: String,
  itemTotal: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('OrderItem', orderItemSchema);