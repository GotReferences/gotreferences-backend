import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

const models = {};
const modelsDir = path.join(__dirname, '../models');
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    try {
    const defineModel = require(path.join(modelsDir, file));
    const model = defineModel(sequelize, DataTypes);
    models[model.name] = model;
    } catch (err) { console.warn(`Skipping model ${file}:`, err.message); }
  });

// Run associations if defined
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize, models };
