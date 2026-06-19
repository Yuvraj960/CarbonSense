const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: user.toPublicJSON() });
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({ success: true, token, user: user.toPublicJSON() });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('team_id', 'name invite_code');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getMe };
