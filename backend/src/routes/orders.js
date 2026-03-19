import express from 'express';
import { body } from 'express-validator';
import {getOrder,rateOrder,getAllOrders,getOrderStats,getMyOrders, createOrder, updateOrderStatus, cancelOrder}from '../controllers/orderController.js';
import {auth} from '../middleware/auth.js';
import {isStaff} from '../middleware/auth.js';
import {validateRequest} from '../middleware/validateRequest.js';

const router = express.Router();
// Customer routes
router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
    body('paymentMethod').isIn(['mobile_money', 'card', 'cash']).withMessage('Invalid payment method'),
  ],
  validateRequest,
 createOrder
);

router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrder);
router.post('/:id/rate', auth, rateOrder);

// Staff routes
router.get('/', auth, isStaff, getAllOrders);
router.put('/:id/status', auth, isStaff, updateOrderStatus);
router.put('/:id/cancel', auth, isStaff, cancelOrder);
router.get('/stats/summary', auth, isStaff, getOrderStats);


export default router;