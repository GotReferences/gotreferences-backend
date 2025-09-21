const express = require('express');
const router = express.Router();

// Sample projects data
const sampleProjects = [
  { id: 1, title: 'Project Alpha', status: 'Open' },
  { id: 2, title: 'Project Beta', status: 'In Progress' },
  { id: 3, title: 'Project Gamma', status: 'Completed' }
];

// GET /api/projects
router.get('/', (req, res) => {
  res.json(sampleProjects);
});

module.exports = router;
