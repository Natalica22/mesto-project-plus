import { Router } from 'express';
import {
  getUser, getUsers, updateUserAvatar, updateUserInfo,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
