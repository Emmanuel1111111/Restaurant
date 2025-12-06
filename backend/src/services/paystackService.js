const axios = require('axios');

const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Initialize payment
const initializePayment = async (email, amount, reference, metadata = {}) => {
  try {
    const response = await paystackAPI.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo/pesewas
      reference,
      metadata,
      callback_url: `${process.env.API_URL}/api/payment/callback`,
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Initialize Error:', error.response?.data);
    throw error;
  }
};

// Verify payment
const verifyPayment = async (reference) => {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Paystack Verify Error:', error.response?.data);
    throw error;
  }
};

// Initiate refund
const refundPayment = async (reference, amount) => {
  try {
    const response = await paystackAPI.post('/refund', {
      transaction: reference,
      amount: amount * 100,
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Refund Error:', error.response?.data);
    throw error;
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  refundPayment,
};
