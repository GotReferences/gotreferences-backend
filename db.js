"use strict";

const { Sequelize } = require("sequelize");

// Database connection pulled from environment variables (Secrets Manager in ECS)
const dbUser = process.env.DB_USER || "gradmin";
const dbPass = process.env.DB_PASS || "JaBah123JaBah123";
const dbHost = process.env.DB_HOST || "gotreferences-aurora-instance.cn2s6a0e8tmp.us-east-1.rds.amazonaws.com";
const dbName = process.env.DB_NAME || "gotreferences";

// Create Sequelize instance with SSL
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "postgres",
  logging: false, // disable noisy SQL logs in production
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // trust AWS RDS CA
    }
  }
});

// Verify connection at startup
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

module.exports = sequelize;