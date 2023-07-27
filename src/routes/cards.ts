import express from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import {
  createCardValidation,
  cardValidation,
} from '../utils/validation';

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', cardValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardValidation, dislikeCard);

export default cardRouter;
