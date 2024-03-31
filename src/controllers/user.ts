import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { responseInternalError, responseValidationError } from '../utils/utils';
import {
  CREATED, JWT_SECRET_KEY, NOT_FOUND, SUCCESSFUL, UNAUTHORIZED,
} from '../utils/constants';

const responseUser = (res: Response, status: number = SUCCESSFUL) => (user: IUser | null) => {
  if (!user) {
    res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
  } else {
    res.status(status).send(user);
  }
};

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch(responseInternalError(res));

export const getUser = (req: Request, res: Response) => {
  const id = req.params.userId;
  return User.findById(id)
    .then(responseUser(res))
    .catch(responseValidationError(res, 'Переданы некорректные данные пользователя'));
};

export const createUser = (req: Request, res: Response) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(responseUser(res, CREATED))
    .catch(responseValidationError(res, 'Переданы некорректные данные при создании пользователя'));
};

export const updateUserInfo = (req: any, res: Response) => {
  const { name, about } = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then(responseUser(res))
    .catch(responseValidationError(res, 'Переданы некорректные данные при обновлении профиля'));
};

export const updateUserAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then(responseUser(res))
    .catch(responseValidationError(res, 'Переданы некорректные данные при обновлении аватара'));
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
          res.cookie('JWT_TOKEN', token, { httpOnly: true });
          return res.send();
        });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED)
        .send({ message: err.message });
    });
};
