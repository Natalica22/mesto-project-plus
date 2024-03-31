import express, { Response, Request } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
import { requestLogger, errorLogger } from './middlewares/logger';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { NOT_FOUND } from './utils/constants';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_URL);

app.use(helmet());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req: Request, res: Response) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
