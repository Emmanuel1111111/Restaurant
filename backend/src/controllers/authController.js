const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { generateOTP, sendOTPSMS } = require('../services/smsService');
const { formatPhoneNumber } = require('../utils/helpers');

// Send OTP to phone number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    // Find or create user
    let user = await User.findOne({ phone: formattedPhone });

    if (!user) {
      user = new User({
        phone: formattedPhone,
        otp: { code: otp, expiresAt },
      });
    } else {
      user.otp = { code: otp, expiresAt };
    }

    await user.save();

    // Send OTP via SMS
    await sendOTPSMS(formattedPhone, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: formattedPhone,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
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

    // Clear OTP
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.userId);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

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
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
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
