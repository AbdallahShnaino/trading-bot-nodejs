const Sequelize = require('sequelize');

const sequelize = new Sequelize('tradingBotDb', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
