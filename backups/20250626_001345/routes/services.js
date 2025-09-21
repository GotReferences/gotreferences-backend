const express   = require("express");
const router    = express.Router();
const sequelize = require("../db");

/* GET /api/services  – list all services (no joins) */
router.get("/", async (_req, res) => {
  try {
    const Service  = sequelize.models.services;   // lowercase model
    const services = await Service.findAll();     // no include
    res.json(services);
  } catch (err) {
    console.error("Service list error:", err);
    res.status(500).json({ error: "Service list failed." });
  }
});

module.exports = router;
