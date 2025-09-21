const express = require('express');
const router = express.Router();
const { Blog } = require('../models');

// GET all blog posts
router.get('/', async (req, res) => {
    try {
        const posts = await Blog.findAll();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Blog.findByPk(req.params.id);
        if (post) res.status(200).json(post);
        else res.status(404).json({ error: 'Post not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new blog post
router.post('/', async (req, res) => {
    try {
        const { user_id, title, content, category, tags, seo_title, seo_description, featured_image } = req.body;
        const newPost = await Blog.create({ user_id, title, content, category, tags, seo_title, seo_description, featured_image });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a blog post
router.put('/:id', async (req, res) => {
    try {
        const { title, content, category, tags, seo_title, seo_description, featured_image } = req.body;
        const post = await Blog.findByPk(req.params.id);
        if (post) {
            await post.update({ title, content, category, tags, seo_title, seo_description, featured_image });
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a blog post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Blog.findByPk(req.params.id);
        if (post) {
            await post.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
