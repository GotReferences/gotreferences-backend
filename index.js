"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

const app = express();
app.use(bodyParser.json());

// Root health check (for ALB)
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// API health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Routes
const { Blog, Project, Review } = require("./models");
const blogRoutes = require("./routes/blog");
const projectRoutes = require("./routes/projects");
const reviewRoutes = require("./routes/reviews");

app.use("/api/blog", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reviews", reviewRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
});
