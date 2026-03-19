import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  items: [{
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
    specialInstructions: String
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  contactNumber: String,
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'mobile_money'],
    required: true
  },
  estimatedDeliveryTime: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);