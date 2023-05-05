const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/database');
const Bot = sequelize.define('Bot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allawNull: false,
    primaryKey: true,
  },
});

module.exports = Bot;
