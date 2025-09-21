"use strict";
const express = require("express");
const router = express.Router();
const { Blog } = require("../models");

const VERSION_MARKER = "blog.js :: UPDATED 2025-09-19 20:50:18Z";

router.get("/", async (req, res) => {
  try {
    const posts = await Blog.findAll({
      attributes: ["id", "title", "seo_description", "created_at"],
      order: [["created_at", "DESC"]],
    });
    res.json({ version: VERSION_MARKER, posts });
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).json({
      error: "Failed to load blog posts",
      version: VERSION_MARKER,
      name: err.name,
      message: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
