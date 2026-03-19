import axios from 'axios';

export const sendSMS = async (phone, message) => {
  try {
    const auth = Buffer.from(
      `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://sms.hubtel.com/v1/messages/send',
      {
        From: process.env.HUBTEL_FROM,
        To: phone,
        Content: message,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ SMS Error:', error.response?.data || error.message);
    throw error;
  }
};

// Send order confirmation SMS
export const sendOrderConfirmationSMS = async (phone, orderNumber) => {
  const message = `Your order ${orderNumber} has been received! We'll notify you when it's ready. Thank you for ordering!`;
  return sendSMS(phone, message);
};

// Send order status update SMS
export const sendOrderStatusSMS = async (phone, orderNumber, status) => {
  const messages = {
    confirmed: `Your order ${orderNumber} has been confirmed and is being prepared.`,
    ready: `Your order ${orderNumber} is ready for pickup!`,
    picked_up: `Your order ${orderNumber} is on the way!`,
    delivered: `Your order ${orderNumber} has been delivered. Enjoy your meal!`,
  };

  const message = messages[status] || `Order ${orderNumber} status: ${status}`;
  return sendSMS(phone, message);
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP SMS
export const sendOTPSMS = async (phone, otp) => {
  const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;
  return sendSMS(phone, message);
};

