import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'GHS' },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile_money', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentDetails: mongoose.Schema.Types.Mixed,
  receiptUrl: String
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);