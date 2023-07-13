const { checkSessionHealth } = require('./../controller/session/session.controller')
module.exports = async (req, res, next) => {
  try {
    
    const result = await checkSessionHealth(req.get('session_id'))
    if (result != false) {
      req.session.isLoggedIn = true;
      const obj = JSON.parse(result.data);
      req.session.user = obj.user
      req.user = obj.user
    }
    if (req.session.isLoggedIn == false || req.user == undefined || result == false ) {
      return res
        .status(303)
        .json({ message: 'unauthorized, need to login before' });
    }else{
      next();
    }

  } catch (error) {
    return res
    .status(303)
    .json({ message: 'unauthorized, need to login before' });
  }

};
