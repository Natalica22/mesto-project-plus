import { createCard, deleteCard, getCards } from '../controllers/card';
import { Router } from 'express';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);

export default cardRouter;
