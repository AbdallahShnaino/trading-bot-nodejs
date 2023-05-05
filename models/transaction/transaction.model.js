const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/database');
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allawNull: false,
    primaryKey: true,
  },
});

module.exports = Transaction;
