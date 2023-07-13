
async function getCurrentUser(req, res, next) {
 // console.log('req.sessionID',req.sessionID)



  if (req.user) {
    req.userId = req.user.userId;
    console.log('state 1')
  } else if (req.session.isLoggedIn) {
    console.log('state 2')
    req.userId = req.session.user.userId;
  } else {
    console.log('state 3')
    return res.status(401).json('need to login before');
  }


  next();
}
module.exports = getCurrentUser;
