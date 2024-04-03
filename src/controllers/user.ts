import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import User, { IUser } from '../models/user';
import translateValidationError from '../utils/utils';
import {
  CREATED, JWT_TOKEN_COOKIE, JWT_SECRET_KEY, SUCCESSFUL,
} from '../utils/constants';
import NotFoundError from '../errors/not-found-error';
import { IAuthRequest } from '../middlewares/auth';

interface INameAbout {
  name: string;
  about: string;
}

interface IAvatar {
  avatar: string;
}

const responseUser = (res: Response, status: number = SUCCESSFUL) => (user: IUser | null) => {
  if (!user) {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  } else {
    res.status(status).send(user);
  }
};

const findUser = (id: any, res: Response, next: NextFunction, err: string) => {
  User.findById(id)
    .then(responseUser(res))
    .catch(translateValidationError(next, err));
};

const updateUser = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
  err: string,
  data: INameAbout | IAvatar,
) => {
  const id = req.user?._id;
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .then(responseUser(res))
    .catch(translateValidationError(next, err));
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return findUser(id, res, next, 'Переданы некорректные данные пользователя');
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(responseUser(res, CREATED))
    .catch(translateValidationError(next, 'Переданы некорректные данные при создании пользователя', 'Пользователь с таким email уже существует'));
};

export const getUserInfo = (req: IAuthRequest, res: Response, next: NextFunction) => findUser(req.user?._id, res, next, 'Переданы некорректные данные при запросе пользователя');

export const updateUserInfo = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, 'Переданы некорректные данные при обновлении профиля', { name, about });
};

export const updateUserAvatar = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, 'Переданы некорректные данные при обновлении аватара', { avatar });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
          res.cookie(JWT_TOKEN_COOKIE, token, { httpOnly: true });
          return res.send();
        });
    })
    .catch(next);
};
