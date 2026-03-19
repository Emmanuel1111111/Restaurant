import mongoose from 'mongoose';

 const settingsSchema = new mongoose.Schema({
  storeName: { type: String, required: true, default: 'Restaurant' },
  contactEmail: String,
  contactPhone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'Ghana' }
  },
  openingHours: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false }
  }],
  deliveryFee: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 }, // in percentage
  isDeliveryAvailable: { type: Boolean, default: true },
  isPickupAvailable: { type: Boolean, default: true },
  deliveryZones: [{
    name: String,
    postcodes: [String],
    deliveryFee: Number
  }],
  paymentMethods: {
    cash: { type: Boolean, default: true },
    card: { type: Boolean, default: true },
    mobileMoney: { type: Boolean, default: true }
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models. Settings || mongoose.model('Settings', settingsSchema);
