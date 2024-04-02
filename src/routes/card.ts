import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/card';
import {
  validateCreateCard, validateDeleteCard, validateDislikeCard, validateLikeCard,
} from '../validation/card';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateDeleteCard, deleteCard);
cardRouter.put('/:cardId/likes', validateLikeCard, likeCard);
cardRouter.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

export default cardRouter;
