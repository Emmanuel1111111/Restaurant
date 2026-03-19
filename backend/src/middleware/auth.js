import { verifyToken } from '../utils/jwt.js';
import User from '../models/Users.js';

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    // Verify token
    const decoded = verifyToken(token);
     console.log('🔍 Decoded token:', decoded); 

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
     console.log('🔍 Found user:', user);
    

    if (!user) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    res.status(401).json({ error: `${error.message}` });
  }
};

// Check if user is staff


export const isStaff = (req, res, next) => {
if (req.user.role !== 'staff') {
 return res.status(403).json({ error: 'Access denied. Staff only.' });
 }
 next();
};