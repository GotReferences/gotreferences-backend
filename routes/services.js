const express = require('express');
const { Service } = require('./../models');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
