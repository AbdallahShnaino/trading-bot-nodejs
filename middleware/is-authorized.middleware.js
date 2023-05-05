module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res
      .status(303)
      .json({ message: 'unauthorized, need to login before' });
  }
  next();
};
