const express = require('express');
const router = express.Router();
const { Project } = require('../models/projectModel');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new project (SS Only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, budget } = req.body;
        const project = await Project.create({
            title,
            description,
            budget,
            created_by: req.user.id
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all open projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll({ where: { status: 'open' } });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign a project to an SP (SS Only)
router.patch('/:id/assign', authMiddleware, async (req, res) => {
    try {
        const { assigned_to } = req.body;
        const project = await Project.findByPk(req.params.id);
        if (!project || project.created_by !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        project.assigned_to = assigned_to;
        project.status = 'in-progress';
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark project as completed (SP Only)
router.patch('/:id/complete', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project || project.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        project.status = 'completed';
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a project update (SP Only)
router.post('/:id/update', authMiddleware, async (req, res) => {
    try {
        const { message, attachments } = req.body;
        const project = await Project.findByPk(req.params.id);
        if (!project || project.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        project.progress_updates.push({
            update_id: new Date().getTime().toString(),
            timestamp: new Date(),
            message,
            attachments
        });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
