const User = require('../../models/user/user.model');
const { encrypt, decrypt, generateID } = require('./../../utils/password');

async function create(fullName, email, password, picture, id, cb) {
  const user = await findByEmail(email);
  if (user) {
    const error = new Error('user exist!');
    throw error;
  }
  if (picture == null && id == null) {
    const userId = await generateID();
    await encrypt(password, async (hashedPassword) => {
      User.create({
        fullName,
        email,
        password: hashedPassword,
        userId: userId,
      })
        .then((result) => {
          cb(result);
        })
        .catch((e) => {
          const error = new Error(e.message);
          throw error;
        });
    });
  } else {
    await User.create({
      fullName,
      email,
      password,
      userId: id,
      imageURL: picture,
    })
      .then((result) => {
        cb(result);
      })
      .catch((e) => {
        const error = new Error(e.message);
        throw error;
      });
  }
}

async function update(
  userId,
  {
    fullName,
    curr_password,
    new_password,
    timezone,
    email,
    imageURL,
    binanceAPIKey,
    binanceSecretKey,
  }
) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (email != undefined) user.email = email;
    if (fullName != undefined) user.fullName = fullName;
    if (imageURL != undefined) user.imageURL = imageURL;
    if (timezone != undefined) user.timezone = timezone;
    if (binanceAPIKey != undefined) user.binanceAPIKey = binanceAPIKey;
    if (binanceSecretKey != undefined) user.binanceSecretKey = binanceSecretKey;

    if (new_password != undefined && curr_password != undefined) {
      await decrypt(curr_password, user.password, () => {
        user.password = new_password;
      });
    }
    console.log(user);
    return await user.save();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user');
  }
}

async function destroy(id) {
  try {
    const user = await User.findByPk(id);
    user.destroy();
  } catch (error) {
    throw error;
  }
}

async function findAll() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw error;
  }
}

async function findByEmail(email) {
  try {
    const user = await User.findOne({ where: { email: email } });
    return user;
  } catch (error) {
    throw error;
  }
}

async function postUpdateUser(req, res, mext) {
  const id = req.userId;
  const {
    fullName,
    curr_password,
    new_password,
    timezone,
    email,
    imageURL,
    binanceAPIKey,
    binanceSecretKey,
  } = req.body;
  try {
    const data = {
      fullName,
      curr_password,
      new_password,
      timezone,
      email,
      imageURL,
      binanceAPIKey,
      binanceSecretKey,
    };
    const user = await update(id, data);
    return res.status(200).json({
      message: 'updated successfully',
      user,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return mext(error);
  }
}

async function deleteUser(req, res) {
  const userId = req.userId;
  try {
    await destroy(userId);
    req.session.destroy();
    return res.status(200).json({
      message: 'deleted successfully',
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return next(error);
  }
}

async function deleteUserByAdmin(req, res) {
  const userId = req.params.id;
  try {
    await destroy(userId);
    req.session.destroy();
    return res.status(200).json({
      message: 'deleted successfully',
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return next(error);
  }
}

async function getUserById(req, res, next) {
  const id = req.params.id;
  try {
    const user = await findById(id);
    if (user) {
      delete user.dataValues.password;
      res.status(200).json(user);
    } else {
      const error = new Error('user not exist');
      error.statusCode = 404;
      return next(error);
    }
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return next(error);
  }
}

async function getUserByEmail(req, res, next) {
  const email = req.params.email;
  try {
    const user = await findByEmail(email);
    if (user) {
      delete user.dataValues.password;
      res.status(200).json(user);
    } else {
      const error = new Error('user not exist');
      error.statusCode = 404;
      return next(error);
    }
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 404;
    return next(error);
  }
}

function whoami(req, res, next) {
  res.status(200).json({ user: req.session.user });
}

module.exports = {
  postUpdateUser,
  deleteUser,
  deleteUserByAdmin,
  getUserById,
  create,
  findById,
  findByEmail,
  getUserByEmail,
  whoami,
};
