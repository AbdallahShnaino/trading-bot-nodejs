const express = require('express');

const facebookAuthRoute = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const {
  findByEmail,
  create,
} = require('./../../controller/user/user.controller');


// http://localhost:3000/auth/facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/redirect',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
      session: false,
    },
    async (accessToken, refreshToken, profile, done) => {
       console.log( profile);

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
      done(null, profile);
    }
  )
);


 facebookAuthRoute.get(
  '/',
  passport.authenticate('facebook', {})
); 
// getGoogleLoginRedirection

facebookAuthRoute.get(
  '/redirect',
  passport.authenticate('facebook', {
    successRedirect: '/auth/facebook/success',
    failureRedirect: '/auth/facebook/failure',
  })
);

facebookAuthRoute.get('/success', (req, res, next) => {
  console.log('req.user',req.user);
/*   console.log(req.user);
  req.session.save(); */

  return res.status(200).send('sucess');
});
facebookAuthRoute.get('/failure', (req, res, next) => {
  return res.status(400).send();
});

module.exports = facebookAuthRoute;
