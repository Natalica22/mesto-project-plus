import { Request, Response } from 'express';
import Card, { ICard } from '../models/card';
import { responseInternalError, responseValidationError } from '../utils/utils';
import { CREATED, NOT_FOUND, SUCCESSFUL } from '../utils/constants';

const responseCard = (res: Response, status: number = SUCCESSFUL) => (card: ICard | null) => {
  if (!card) {
    res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
  } else {
    res.status(status).send(card);
  }
};

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(responseInternalError(res));

export const createCard = (req: any, res: Response) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then(responseCard(res, CREATED))
    .catch(responseValidationError(res, 'Переданы некорректные данные при создании карточки'));
};

export const deleteCard = (req: any, res: Response) => {
  const id = req.params.cardId;
  return Card.findByIdAndDelete(id)
    .then(responseCard(res))
    .catch(responseInternalError(res));
};

export const likeCard = (req: any, res: Response) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then(responseCard(res))
    .catch(responseValidationError(res, 'Переданы некорректные данные для постановки/снятии лайка'));
};

export const dislikeCard = (req: any, res: Response) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then(responseCard(res))
    .catch(responseValidationError(res, 'Переданы некорректные данные для постановки/снятии лайка'));
};
