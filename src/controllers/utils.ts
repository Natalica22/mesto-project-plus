import { Response } from "express";

export const responseInternalError = (res: Response) => (err: Error) => {
  res.status(500).send({ message: 'Внутренняя ошибка сервера' });
}

export const responseValidationError = (res: Response, validationError: String) => (err: Error) => {
  if (err.name.includes('ValidationError')) {
    res.status(400).send({ message: validationError });
  } else {
    responseInternalError(res)(err);
  }
}