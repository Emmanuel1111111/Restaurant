const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Get cart
router.get('/', auth, cartController.getCart);

// Add item to cart
router.post(
  '/add',
  auth,
  [
    body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validateRequest,
  cartController.addToCart
);

// Update item quantity
router.put(
  '/update',
  auth,
  [
    body('itemIndex').isInt({ min: 0 }).withMessage('Valid item index is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  ],
  validateRequest,
  cartController.updateCartItem
);

// Remove item from cart
router.delete(
  '/remove',
  auth,
  [
    body('itemIndex').isInt({ min: 0 }).withMessage('Valid item index is required'),
  ],
  validateRequest,
  cartController.removeFromCart
);

// Clear entire cart
router.delete('/clear', auth, cartController.clearCart);

module.exports = router;
