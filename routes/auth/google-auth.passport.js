const express = require('express');
const googleAuthRouter = express.Router();
// lin for auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const {
  findByEmail,
  create,
} = require('./../../controller/user/user.controller');


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



googleAuthRouter.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
// getGoogleLoginRedirection

googleAuthRouter.get(
  '/redirect',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure',
  })
);

googleAuthRouter.get('/success', (req, res, next) => {
  console.log(req.user);
  req.session.save();

  return res.status(200).send(req.user);
});
googleAuthRouter.get('/failure', (req, res, next) => {
  return res.status(400).send();
});



module.exports = googleAuthRouter;
