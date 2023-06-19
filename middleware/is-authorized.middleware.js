module.exports = (req, res, next) => {
  if (req.session.isLoggedIn == false && req.user == undefined) {
    console.log('req.session.isLoggedIn');
    console.log(req.session.isLoggedIn);
    console.log('req.user');
    console.log(req.user);
    return res
      .status(303)
      .json({ message: 'unauthorized, need to login before' });
  }
  next();
};
