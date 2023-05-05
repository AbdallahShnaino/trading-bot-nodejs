const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
async function generateID() {
  const uuid = uuidv4();
  try {
    const hash = await bcrypt.hash(uuid, 10);
    return hash.substring(0, 15);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function encrypt(password, cb) {
  bcrypt.hash(password, 5, async (err, hash) => {
    if (err) {
      throw err;
    }

    cb(hash);
  });
}

async function decrypt(password1, password2, cb) {
  bcrypt.compare(password1, password2, (err, result) => {
    if (err || result == false) {
      cb(result);
      //   throw err;
    } else {
      console.log(`result of decrypt : ${result}`);
      cb(true);
    }
  });
}

/* 

async function generateToken () {
  crypto.randomBytes(32,(error,buffer)=>{
    if(error){
      throw error
    }
    const token = buffer.toString('hex')
  })
}


*/

module.exports = {
  encrypt,
  decrypt,
  generateID,
};
