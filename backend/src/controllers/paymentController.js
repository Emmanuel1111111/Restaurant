const crypto = require('crypto');
const { initializePayment, verifyPayment } = require('../services/paystackService');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const user = await User.findById(req.userId);
    const email = user.email || `${user.phone}@temp.com`;

    const reference = `ord_${orderId}_${Date.now()}`;

    const payment = await initializePayment(
      email,
      amount,
      reference,
      { orderId }
    );

    res.json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference: payment.data.reference,
    });
  } catch (error) {
    console.error('Initialize Payment Error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const payment = await verifyPayment(reference);

    if (payment.data.status === 'success') {
      // Update order payment status
      const orderId = payment.data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paystackReference: reference,
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: payment.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// Paystack webhook (for real-time payment notifications)
exports.paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    // Handle different event types
    if (event.event === 'charge.success') {
      const orderId = event.data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paystackReference: event.data.reference,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};
