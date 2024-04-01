import { NextFunction, Request, Response } from 'express';
import { IError } from '../errors/types';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  return res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'Внутренняя ошибка сервера'
        : message,
    });
};

export default errorHandler;
