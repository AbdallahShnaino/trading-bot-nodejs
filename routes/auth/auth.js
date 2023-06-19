const express = require('express');
const { Session } = require('express-session');

const authRouter = express.Router();
// lin for auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const isAuth = require('./../../middleware/is-authorized.middleware');
const { body } = require('express-validator');
const {
  findByEmail,
  create,
} = require('./../../controller/user/user.controller');
const {
  postSignup,
  postLogin,
  getLogout,
} = require('../../controller/auth/auth.controller');

//   http://localhost:3000/auth/google
//   http://localhost:3000/auth/test

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
      session: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      //  console.log(accessToken, refreshToken, profile);

      passport.serializeUser(function (user, cb) {
        const u = user;
        process.nextTick(async function () {
          const { sub: id, email, name, picture } = u._json;
          console.log(u._json);
          const user = await findByEmail(email);

          if (user == null) {
            console.log('passport have a new user');
            return await create(name, email, '', picture, id, (user) => {
              return cb(null, email);
            });
          } else {
            console.log('passport say this user in db before');
            return cb(null, email);
          }
        });
      });

      passport.deserializeUser(async function (email, cb) {
        console.log('passport say this user in db and have a session');

        const user = await findByEmail(email);
        if (user == null) {
          // register it user not exist
          //  console.log('register it user not exist');
          //  console.log(user);
          const err = new Error('user not exist');
          return cb(err);
        } else {
          // contenue login operation
          // console.log('contenue login operation');
          // console.log(user);
          console.log('passport say this user in db and have a session');

          return cb(null, user);
        }
      });

      //   const { sub: id, email, name, picture } = profile._json;
      //    await googleAuthUser(id, email, name, picture);
      //     console.log('passport callback executed!');
      done(null, profile);
    }
  )
);

authRouter.post(
  '/signup',
  [
    body('email', 'email is not valid').isEmail().toLowerCase().trim(),
    body('fullName', 'fullName is not valid or empty')
      .isLength({ min: 5, max: 15 })
      .isString()
      .trim(),
    body('password', 'password is not valid or empty')
      .isLength({ min: 5, max: 15 })
      // .isAlphanumeric()
      .trim(),
  ],
  postSignup
);

authRouter.post('/login', postLogin);

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
// getGoogleLoginRedirection

authRouter.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure',
  })
);

authRouter.get('/google/success', (req, res, next) => {
  console.log(req.user);
  req.session.save();

  return res.status(200).send(req.user);
});
authRouter.get('/google/failure', (req, res, next) => {
  return res.status(400).send();
});
authRouter.get('/test', isAuth, (req, res, next) => {
  return res.status(200).send('hellllllllllllllllllllloooooo');
});
/* 
authRouter.get(
  '/test',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  (req, res, next) => {
    return res.status(200).send('hellllllllllllllllllllloooooo');
  }
);
*/
/*
// getLoginWithFacebook
authRouter.get('/facebook', () => {});
*/
authRouter.get('/logout', getLogout);

module.exports = authRouter;
