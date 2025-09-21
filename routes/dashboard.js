const express = require('express');
const router = express.Router();
const { Project, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/dashboard/project-stats
router.get('/project-stats', async (req, res) => {
  try {
    const ownerId = req.user.sub;

    // Fetch metrics in parallel
    const [totalProjects, completedProjects, avgResult] = await Promise.all([
      Project.count({ where: { owner_id: ownerId } }),
      Project.count({ where: { owner_id: ownerId, status: 'completed' } }),
      Project.findOne({
        where: { owner_id: ownerId },
        attributes: [[sequelize.fn('AVG', sequelize.col('budget')), 'averageBudget']],
        raw: true
      })
    ]);

    const averageBudget = parseFloat(avgResult?.averageBudget) || 0;

    return res.json({ totalProjects, completedProjects, averageBudget });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
