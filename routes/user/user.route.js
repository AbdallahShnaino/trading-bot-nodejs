const express = require('express');
const userRouter = express.Router();
const isAuthorized = require('../../middleware/is-authorized.middleware');
const getCurrentUser = require('../../middleware/storeId.middleware');

const {
  postUpdateUser,
  deleteUser,
  deleteUserByAdmin,
  getUserById,
  getUserByEmail,
  whoami,
} = require('../../controller/user/user.controller');

userRouter.post('/update', isAuthorized, getCurrentUser, postUpdateUser);
userRouter.delete('/delete', isAuthorized, getCurrentUser, deleteUser);
userRouter.delete(
  '/delete/:id',
  isAuthorized,
  getCurrentUser,
  deleteUserByAdmin
);
userRouter.get('/id/:id', isAuthorized, getCurrentUser, getUserById);
userRouter.get('/email/:email', isAuthorized, getCurrentUser, getUserByEmail);
userRouter.get('/whoami', isAuthorized, getCurrentUser, whoami);

module.exports = userRouter;
