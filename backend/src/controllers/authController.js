// controllers/authController.js
import userSchema from '../models/Users.js';
import twilio from 'twilio';   
import {formatPhoneNumber }from '../utils/helpers.js';
import { generateToken} from '../utils/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const User = userSchema;
// Initialize Twilio client/
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP to user's phone
export const sendOTP = async (phone) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    

    // Send OTP via Twilio (uncomment in production)
    const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });  // or 'call' for voice call

    return verification;



  } catch (error) {
    console.error('Send OTP Error:', error);
    throw new Error('Failed to send OTP :', error.message);
  }
};

// Verify OTP and login
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    // Find user
    const user = await User.findOne({ phone: formattedPhone });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Verify OTP
    const isValid = await user.compareOTP(otp);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update user info if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Clear OTP
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Return user data and token

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
  
};




// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-otp');

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};





