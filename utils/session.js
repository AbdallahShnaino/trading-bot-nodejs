const sequelize = require('./../utils/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 10000, //15 * 60 * 1000,
  expiration: 100000, //24 * 60 * 60 * 1000,
});

module.exports = mySessionStore;
