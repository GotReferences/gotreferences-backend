const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const { Review } = require('../models');
const { authMiddleware } = require('../middleware/authMiddleware');

AWS.config.update({ region: 'us-east-1' });
const comprehend = new AWS.Comprehend();

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new review with sentiment analysis
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;

        let sentimentData = null;

        if (comment) {
            const params = {
                LanguageCode: 'en',
                Text: comment
            };
            sentimentData = await comprehend.detectSentiment(params).promise();
        }

        const newReview = await Review.create({
            ...req.body,
            sentiment: sentimentData ? sentimentData.Sentiment : null,
            positive_score: sentimentData ? sentimentData.SentimentScore.Positive : null,
            negative_score: sentimentData ? sentimentData.SentimentScore.Negative : null,
            neutral_score: sentimentData ? sentimentData.SentimentScore.Neutral : null,
            mixed_score: sentimentData ? sentimentData.SentimentScore.Mixed : null
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single review by id
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a review by id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        await review.update(req.body);
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a review by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        await review.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
