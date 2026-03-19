import express from 'express';
import { body } from 'express-validator';
import {addToCart,updateCartItem,removeFromCart,clearCart,getCart} from '../controllers/cartController.js';
import {auth} from '../middleware/auth.js';
import {validateRequest} from '../middleware/validateRequest.js';

const router = express.Router();
// Get cart
router.get('/cart', auth, getCart);

// Add item to cart
router.post(
  '/add',
  auth,
  [
    body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validateRequest,
 addToCart
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
updateCartItem
);

// Remove item from cart
router.delete(
  '/remove',
  auth,
  [
    body('itemIndex').isInt({ min: 0 }).withMessage('Valid item index is required'),
  ],
  validateRequest,
 removeFromCart
);

// Clear entire cart
router.delete('/clear', auth, clearCart);


export default router;