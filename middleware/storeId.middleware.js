function getCurrentUser(req, res, next) {
  if (req.user) {
    req.userId = req.user.userId;
  } else if (req.session.isLoggedIn) {
    req.userId = req.session.user.userId;
  } else {
    return res.status(401).json('need to login before');
  }
  next();
}
module.exports = getCurrentUser;
