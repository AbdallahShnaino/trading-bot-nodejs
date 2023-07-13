const Session = require('./../../models/session/session.model')

async function checkSessionHealth( sessionId ) {
    const session = await Session.findOne({  where: { sid: sessionId }  });
    if(!session){
        return false
    }else{
        return session
    }

}

module.exports = {checkSessionHealth}