const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { authMiddleware } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const passwordHash = await argon2.hash(password);

    const newUser = await User.create({ username, email, passwordHash, role });
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'R0arxkVnkySt3sDllTD6n8XdBopDVD2UpJpt6wV7dQc=', {
      expiresIn: '2h'
    });

    res.json({ message: 'Login successful.', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login user.' });
  }
});

// Get current user info (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// Get all users (protected/admin route)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
