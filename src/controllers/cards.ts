import { NextFunction, Request, Response } from 'express';
import card from '../models/card';
import { OK } from '../constants/codes';
import BadRequest from '../errors/BadRequest';
import NotFound from '../errors/NotFound';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((createdCart) => res.status(OK).send(createdCart))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  card.findByIdAndRemove(req.params.cardId).orFail()
    .then((deletedCard) => res.status(OK).send(deletedCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new NotFound('Передан невалидный _id'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail()
    .then((cardLike) => res.status(OK).send(cardLike))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new NotFound('Передан невалидный _id'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((cardDislike) => res.status(OK).send(cardDislike))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new NotFound('Передан невалидный _id'));
      } else {
        next(err);
      }
    });
};
