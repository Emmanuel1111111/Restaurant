import express from 'express';
import { body } from 'express-validator';
import { sendOTP, verifyOTP,updateProfile,getMe } from '../controllers/authController.js';
import {loginUser, signUpUser} from '../controllers/userController.js';
import {auth }from '../middleware/auth.js';
import {validateRequest} from '../middleware/validateRequest.js';

const router = express.Router();


// Send OTP
router.post(
  '/send-otp',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  ],
  validateRequest,
  sendOTP
);

// Verify OTP
router.post(
  '/verify-otp',
  [
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  verifyOTP
);

// Get current user
router.get('/me', getMe);

// Update profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail(),
  ],
  validateRequest,
 updateProfile
);

router.post('/auth', loginUser);
router.post('/signup', signUpUser);


export default router;