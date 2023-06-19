const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/database');
const Strategy = sequelize.define('Strategy', {
  userId: {
    type: DataTypes.STRING,
    allawNull: false,
  },
  strategyData: {
    type: DataTypes.STRING,
    allawNull: false,
  },
});

module.exports = Strategy;
