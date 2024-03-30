import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { responseInternalError, responseValidationError } from '../utils/utils';
import { CREATED, NOT_FOUND, SUCCESSFUL } from '../utils/constants';

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
    .catch(responseValidationError(res));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
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
