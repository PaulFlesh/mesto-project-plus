import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
