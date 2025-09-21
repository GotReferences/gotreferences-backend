const Sequelize = require('sequelize');
const sequelize = require('../db');

const users = require('./userModel')(sequelize);
const Project = require('./projectModel')(sequelize);
const Service = require('./serviceModel')(sequelize);
const Review = require('./reviewModel')(sequelize);
const Blog = require('./blogModel')(sequelize);
Service.belongsTo(users, { foreignKey: 'created_by', as: 'creator' });
users.hasMany(Service,   { foreignKey: 'created_by', as: 'services' });
module.exports = {
  sequelize,
  users,
  Project,
  Service,
  Review,
  Blog
};

