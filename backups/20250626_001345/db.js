const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Properly initialize models with Sequelize instance
const User = require('./models/userModel')(sequelize);
const Project = require('./models/projectModel')(sequelize);
const Service = require('./models/serviceModel')(sequelize);
const Review = require('./models/reviewModel')(sequelize);

// Export the sequelize instance
module.exports = sequelize;
