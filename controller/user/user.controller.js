const User = require('../../models/user/user.model');
const { encrypt, decrypt, generateID } = require('./../../utils/password');

async function create(fullName, email, password, cb) {
  const user = await findByEmail(email);
  if (user) {
    const error = new Error('user exist!');
    throw error;
  }
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
}

async function update(
  id,
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
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }
    if (user.userId !== req.session.userId) {
      throw new Error('Un Auth recource');
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
    const users = await User.findByPk(id);
    return users;
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

async function postUpdateUser(req, res) {
  const id = req.params.id;
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
    return next(error);
  }
}

async function deleteUser(req, res) {
  const id = req.session.user.id;
  try {
    await destroy(id);
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
  const id = req.params.id;
  try {
    await destroy(id);
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
