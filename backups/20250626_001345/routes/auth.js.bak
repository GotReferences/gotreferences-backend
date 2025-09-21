const express = require('express');
const router  = express.Router();
const argon2  = require('argon2');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// shared secret – use env var in production
const JWT_SECRET = process.env.JWT_SECRET || 'gr-secret';

// ------------------------------------------------------------------
// POST /api/auth/register
// ------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // hash password
    const hash = await argon2.hash(password);

    // insert user
    const [{ id }] = await db.query(
      'INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id',
      [username, email, hash]
    );

    // issue token
    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, username, email } });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ message: 'Email already in use' });
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [user] = await db.query(
      'SELECT id, username, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok)   return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;