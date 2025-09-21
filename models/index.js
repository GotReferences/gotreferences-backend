"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const db = {};

const config = {
  host: process.env.PGHOST || "gotreferences-aurora-instance.cn2s6a0e8tmp.us-east-1.rds.amazonaws.com",
  database: process.env.PGDATABASE || "gotreferences",
  username: process.env.PGUSER || "gradmin",
  password: process.env.PGPASSWORD || "JaBah123JaBah123",
  dialect: "postgres",
  dialectOptions: {},
  logging: false,
};

if (process.env.NODE_ENV === "production") {
  config.dialectOptions.ssl = { require: true, rejectUnauthorized: true };
  if (fs.existsSync("/usr/local/share/ca-certificates/rds-combined-ca-bundle.pem")) {
    config.dialectOptions.ssl.ca = fs.readFileSync("/usr/local/share/ca-certificates/rds-combined-ca-bundle.pem").toString();
  }
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Auto-load every .js model file except this index.js
fs.readdirSync(__dirname)
  .filter(f => f.endsWith(".js") && f !== basename)
  .forEach(f => {
    const model = require(path.join(__dirname, f))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
