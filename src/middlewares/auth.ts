import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_TOKEN_COOKIE, JWT_SECRET_KEY } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-error';

export interface IAuthRequest extends Request {
  user?: {
    _id: JwtPayload | string
  };
}

export const authHandler = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[JWT_TOKEN_COOKIE];
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload as { _id: JwtPayload | string };

  return next();
};
