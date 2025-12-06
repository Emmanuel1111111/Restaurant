// API Configuration
export const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
export const TIMEOUT = 10000;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  CASH: 'cash',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  DRIVER: 'driver',
};

// Colors
export const COLORS = {
  PRIMARY: '#FF6B35',
  SECONDARY: '#004E89',
  SUCCESS: '#06A77D',
  WARNING: '#F77F00',
  DANGER: '#E63946',
  LIGHT: '#F5F5F5',
  DARK: '#222222',
  GRAY: '#888888',
  WHITE: '#FFFFFF',
  BACKGROUND: '#FAFAFA',
};

// Sizes
export const SIZES = {
  XS: 8,
  SM: 12,
  MD: 16,
  LG: 20,
  XL: 24,
  XXL: 32,
};

// Delivery Settings
export const DELIVERY_FEE = 5;
export const MINIMUM_ORDER = 20;
export const DELIVERY_RADIUS = 5; // kilometers
export const ESTIMATED_DELIVERY_TIME = 40; // minutes

// Other
export const OTP_LENGTH = 6;
export const OTP_EXPIRY = 10; // minutes
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';
export const CART_KEY = 'cart_items';
