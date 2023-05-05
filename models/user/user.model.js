const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/database');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allawNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  binanceAPIKey: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  binanceSecretKey: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  imageURL: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  balance: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = User;
