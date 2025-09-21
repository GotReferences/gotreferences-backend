const { DataTypes } = require('sequelize');
const argon2 = require('argon2');

module.exports = (sequelize) => {
  const Users = sequelize.define(
    'users',                      // model name lowercase
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      email:    { type: DataTypes.STRING, unique: true, allowNull: false, validate:{isEmail:true}},
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('service_seeker','service_provider','admin'), defaultValue:'service_seeker' },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: 'users',         // exact Postgres table
      freezeTableName: true,
      timestamps: false,
    }
  );

  Users.beforeCreate(async u => { u.passwordHash = await argon2.hash(u.passwordHash); });
  return Users;
};
