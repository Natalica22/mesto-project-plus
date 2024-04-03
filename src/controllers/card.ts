import { NextFunction, Request, Response } from 'express';
import Card, { ICard } from '../models/card';
import translateValidationError from '../utils/utils';
import { CREATED, SUCCESSFUL } from '../utils/constants';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden -error';
import { IAuthRequest } from '../middlewares/auth';

const responseCard = (res: Response, status: number = SUCCESSFUL) => (card: ICard | null) => {
  if (!card) {
    throw new NotFoundError('Карточка с указанным _id не найдена');
  } else {
    res.status(status).send(card);
  }
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then(responseCard(res, CREATED))
    .catch(translateValidationError(next, 'Переданы некорректные данные при создании карточки'));
};

export const deleteCard = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  return Card.findById(id)
    .then((card) => {
      if (card && card.owner.toString() === req.user?._id) {
        return card.deleteOne();
      }
      return Promise.reject(new ForbiddenError('Нет прав удалить карточку'));
    })
    .then(responseCard(res))
    .catch(translateValidationError(next, 'Переданны некорректные данные о карточке'));
};

export const likeCard = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then(responseCard(res))
    .catch(translateValidationError(next, 'Переданы некорректные данные для постановки/снятии лайка'));
};

export const dislikeCard = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then(responseCard(res))
    .catch(translateValidationError(next, 'Переданы некорректные данные для постановки/снятии лайка'));
};
