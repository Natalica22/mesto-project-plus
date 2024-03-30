import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { NOT_FOUND } from './utils/constants';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_URL);

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66059cf0d88b452a568026cd',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
