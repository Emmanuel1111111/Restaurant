// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { string } from 'zod';

import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Method to generate OTP


// Method to compare OTP
userSchema.methods.compareOTP = function(otp) {
  return this.otp && this.otp.code === otp;
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

userSchema.methods.verifyToken= function(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default mongoose.model('User', userSchema);