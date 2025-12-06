const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/initialize', auth, paymentController.initializePayment);
router.get('/verify/:reference', auth, paymentController.verifyPayment);
router.post('/webhook', paymentController.paystackWebhook);

module.exports = router;
