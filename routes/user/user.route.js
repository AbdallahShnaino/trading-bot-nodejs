const express = require('express');
const userRouter = express.Router();
const isAuthorized = require('../../middleware/is-authorized.middleware');
const {
  postUpdateUser,
  deleteUser,
  deleteUserByAdmin,
  getUserById,
  getUserByEmail,
  whoami,
} = require('../../controller/user/user.controller');

userRouter.post('/:id/update', isAuthorized, postUpdateUser);
userRouter.delete('/delete', isAuthorized, deleteUser);
userRouter.delete('/delete/:id', deleteUserByAdmin);
userRouter.get('/id/:id', getUserById);
userRouter.get('/email/:email', getUserByEmail);
userRouter.get('/whoami', isAuthorized, whoami);

module.exports = userRouter;
