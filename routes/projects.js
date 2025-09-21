const express = require('express');
const { Project } = require('./../models');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
