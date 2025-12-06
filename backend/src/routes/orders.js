const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { auth, isStaff } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

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
  orderController.createOrder
);

router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrder);
router.post('/:id/rate', auth, orderController.rateOrder);

// Staff routes
router.get('/', auth, isStaff, orderController.getAllOrders);
router.put('/:id/status', auth, isStaff, orderController.updateOrderStatus);
router.put('/:id/cancel', auth, isStaff, orderController.cancelOrder);
router.get('/stats/summary', auth, isStaff, orderController.getOrderStats);

module.exports = router;
