import {
  Response, Request, NextFunction, Router,
} from 'express';
import userRouter from './user';
import cardRouter from './card';
import { createUser, login } from '../controllers/user';
import { authHandler } from '../middlewares/auth';
import { validateCreateUser, validateLogin } from '../validation/user';
import NotFoundError from '../errors/not-found-error';

const router = Router();

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(authHandler);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default router;
