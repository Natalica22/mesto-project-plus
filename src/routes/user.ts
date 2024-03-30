import { Router } from 'express';
import {
  createUser, getUser, getUsers, updateUserAvatar, updateUserInfo,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
