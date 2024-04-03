import express from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errors';
import { DB_URL, PORT } from './config';
import router from './routes';

const app = express();

app.use(express.json());

mongoose.connect(DB_URL);

app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
