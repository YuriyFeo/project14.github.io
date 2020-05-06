const userRouter = require('express').Router();
const { getUsers, findUser, createUser } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', findUser);

module.exports = userRouter;
