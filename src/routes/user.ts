import { Router } from 'express';
import {
  getUser, getUserInfo, getUsers, updateUserAvatar, updateUserInfo,
} from '../controllers/user';
import { validateGetUser, validateUpdateUserAvatar, validateUpdateUserInfo } from '../validation/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:userId', validateGetUser, getUser);
userRouter.patch('/me', validateUpdateUserInfo, updateUserInfo);
userRouter.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default userRouter;
