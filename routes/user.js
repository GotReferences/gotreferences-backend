const express = require('express');
const router = express.Router();

// GET current user profile
router.get('/profile', (req, res) => {
  res.json(req.user);
});

module.exports = router;
