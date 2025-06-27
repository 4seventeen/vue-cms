const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Example model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Add more models here and export
module.exports = {
  sequelize,
  User
};
