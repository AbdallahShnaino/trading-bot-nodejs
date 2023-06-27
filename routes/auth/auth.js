const express = require('express');
const { Session } = require('express-session');

const authRouter = express.Router();
const { body } = require('express-validator');
const {
  postSignup,
  postLogin,
  getLogout,
} = require('../../controller/auth/auth.controller');

const googleAuthRouter = require('./google-auth.passport')
const facebookAuthRoute = require('./facebook-auth.passport')

authRouter.use('/google',googleAuthRouter)
authRouter.use('/facebook',facebookAuthRoute)

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



authRouter.post('/login', postLogin );
authRouter.get('/logout', getLogout);

module.exports = authRouter;
