import { Response } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from './constants';

export const responseInternalError = (res: Response) => () => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
};

export const responseValidationError = (res: Response, validationError: String = '') => (err: Error) => {
  if (err.name.includes('ValidationError') || err.name.includes('CastError')) {
    res.status(BAD_REQUEST).send({ message: validationError });
  } else {
    responseInternalError(res)();
  }
};
