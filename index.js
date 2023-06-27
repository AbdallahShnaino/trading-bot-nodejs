const sequelize = require('./utils/database');
const express = require('express');
const app = express();
const cors = require('cors');
const csurf = require('csurf');
const session = require('express-session');
const mySessionStore = require('./utils/session');
const passport = require('passport');
const helmet = require('helmet');
const crypto = require('crypto');

app.use(helmet());

require('dotenv').config();

//middelwares
const authRoute = require('./routes/auth/auth');
const userRoute = require('./routes/user/user.route');
const strategyRouter = require('./routes/strategy/strategy.route');
app.use(
  session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: mySessionStore,
    resave: false,
    //  proxy: true, // if you do SSL outside of node.
  })
);
app.use(passport.session());

// csurf activation
const csurfProtection = csurf();
//app.use(csurfProtection);
app.use((req, res, next) => {
  // console.log(req.session.csrfToken());
  //req.locals.isAuthonticated = req.session.isLoggedIn;
  //req.locals.csrfToken = req.session.csrfToken();
  //console.log(req.locals);
  next();
});
/*
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

*/

app.use(cors());
app.use(express.json());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/strategy', strategyRouter);
app.use((error, req, res, next) => {
  return res.status(error.statusCode | 400).json({
    message: error.message,
  });
});
// models
//const User = require('./models/user/user.model');
//const Transaction = require('./models/transaction/transaction.model');
//const Strategy = require('./models/strategy/strategy.nodel');

// database associations
//Bot.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//User.hasMany(Bot);

// database config
sequelize
  .sync({ focus: true })
  // .sync()
  .then((result) => {
    mySessionStore
      .sync({ focus: true })
      .then(() => {
        mySessionStore;
        app.listen(3000);
      })
      .catch(() => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
