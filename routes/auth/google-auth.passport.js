const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const googleAuthRouter = express.Router();
const {
  findByEmail,
  create,
} = require('./../../controller/user/user.controller');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => {
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
}));

googleAuthRouter.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

googleAuthRouter.get(
  '/redirect',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure',
  })
);

googleAuthRouter.get('/success', (req, res, next) => {
  req.session.save(function (err , session) {
    if (err) console.log(err)

    return res.status(200).set('session_id', req.sessionID).json({
        message:req.user
      });
  })
});
googleAuthRouter.get('/failure', (req, res, next) => {
  return res.status(400).json({message:"login by google account faild"});
});


module.exports = googleAuthRouter;
