const {
  create,
  findByEmail,
} = require('./../../controller/user/user.controller');
const { encrypt, decrypt } = require('./../../utils/password');
const { validationResult } = require('express-validator');

async function postSignup(req, res, next) {
  const { fullName, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msgs = [];
    errors.array().filter((e) => msgs.push(e.msg));
    console.log(msgs);

    return res.status(422).json({
      messages: msgs,
    });
  }
  try {
    const self = null;
    await create(fullName, email, password, self, self, (user) => {
      /*
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save();
  */
      return res.status(200).json({
        message: 'signup successfully',
      });
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return next(error);
  }
}

async function postLogin(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await findByEmail(email);
    if (!user) {
      const error = new Error('user not exist');
      error.statusCode = 404;
      return next(error);
    }

    await decrypt(password, user.password, (result) => {
      if (result == true) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save();
        console.log(req.session);
        return res.status(200).json({
          message: 'login successfully',
          user: user,
        });
      } else {
        const error = new Error('password is not correct!');
        error.statusCode = 401;
        return next(error);
      }
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 400;
    return next(error);
  }
}

async function getLogout(req, res) {
  req.session.isLoggedIn = false;
  req.session.user = null;
  req.user = null;
  req.session.destroy();
  //req.session.save();
  res.status(200).json({ message: 'loggedout' });
}

module.exports = {
  postSignup,
  postLogin,
  getLogout,
};
