import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { createUser, login } from './controllers/user';
import { authHandler } from './middlewares/auth';
import errorHandler from './middlewares/errors';
import { validateCreateUser, validateLogin } from './validation/user';
import NotFoundError from './errors/not-found-error';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_URL);

app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(authHandler);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
