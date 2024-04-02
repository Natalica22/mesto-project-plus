import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_TOKEN_COOKIE, JWT_SECRET_KEY } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-error';

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[JWT_TOKEN_COOKIE];
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
