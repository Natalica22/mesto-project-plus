import { createUser, getUser, getUsers } from '../controllers/user';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);

export default userRouter;
