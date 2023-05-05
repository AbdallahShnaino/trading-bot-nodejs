const sequelize = require('./utils/database');
const express = require('express');
const app = express();
const cors = require('cors');
const csurf = require('csurf');
const session = require('express-session');
const mySessionStore = require('./utils/session');

//middelwares
const authRoute = require('./routes/auth/auth');
const userRoute = require('./routes/user/user.route');
const botRouter = require('./routes/bot/bot.route');
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: mySessionStore,
    resave: false,
    //  proxy: true, // if you do SSL outside of node.
  })
);

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
app.use('/bot', botRouter);
app.use((error, req, res, next) => {
  return res.status(error.statusCode | 400).json({
    message: error.message,
  });
});
// models
const User = require('./models/user/user.model');
//const Transaction = require('./models/transaction/transaction.model');
const Bot = require('./models/bot/bot.nodel');

// database associations
Bot.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Bot);

// database config
sequelize
  .sync({ focus: true })
  // .sync()
  .then((result) => {
    mySessionStore
      .sync({ focus: true })
      .then(() => {
        mySessionStore;
        console.log(result.models);
        app.listen(3000);
      })
      .catch(() => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
