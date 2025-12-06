const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Send OTP
router.post(
  '/send-otp',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  ],
  validateRequest,
  authController.sendOTP
);

// Verify OTP
router.post(
  '/verify-otp',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  authController.verifyOTP
);

// Get current user
router.get('/me', auth, authController.getMe);

// Update profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail(),
  ],
  validateRequest,
  authController.updateProfile
);

module.exports = router;
