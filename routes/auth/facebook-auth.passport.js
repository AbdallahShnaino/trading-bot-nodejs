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

  // Check if the user data is in the correct format.
  if (!profile.id) {
    return done(new Error('Failed to deserialize user out of session passport'));
  }

  // Serialize the user data.
  passport.serializeUser(async (user, done) => {
    const commingUser = user
    try {
      const {email , name , picture} = commingUser._json
      const user = await findByEmail(email);
      if (user == null) {
        console.log('passport have a new user');
        return await create(name, email, '', picture, commingUser.id, (serializedUser) => {
          done(null, serializedUser);
        });
      } else {
        console.log('passport say this user in db before');
        return done(null, user);
      }

     // const serializedUser = JSON.stringify(user);
   //   done(null, serializedUser);
    } catch (error) {
      done(error);
    }
  });

    // Deserialize the user data.
    passport.deserializeUser((user, done) => {
      const deserializedUser = user
      try {
        done(null, deserializedUser);
      } catch (error) {
        // If the user data is not in the correct format, then log the user out.
        done(new Error('Failed to deserialize user out of session passport'));
      }
    });


  // Authenticate the user.
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
  req.session.save(function (err , session) {
    if (err) console.log(err)

    return res.status(200).set('session_id', req.sessionID).json({
        message:req.user
      });
  })

});
facebookAuthRoute.get('/failure', (req, res, next) => {
  return res.status(400).send();
});

module.exports = facebookAuthRoute;
