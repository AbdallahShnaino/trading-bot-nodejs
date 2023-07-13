const sequelize = require('./../utils/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
  };
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  secret: "asfguasfgivubsadkfghjsdfhguihdgdsf",
  extendDefaultFields: extendDefaultFields,
  checkExpirationInterval: 10000, //15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000,
});


module.exports = mySessionStore;
