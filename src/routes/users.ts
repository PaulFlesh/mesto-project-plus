import express from 'express';
import {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import {
  getUserValidation,
  updateUserValidation,
  updateUserAvatarValidation,
} from '../utils/validation';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);
userRouter.get('/:userId', getUserValidation, getUser);

export default userRouter;
