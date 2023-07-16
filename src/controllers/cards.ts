import { Request, Response } from 'express';
import card from '../models/card';
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} from '../constants/codes';

export const getCards = (req: Request, res: Response) => {
  card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: res.statusMessage }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  card.create({ name, link })
    .then((createdCart) => res.status(OK).send(createdCart))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((deletedCard) => res.status(OK).send(deletedCard))
    .catch(() => res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' }));
};

export const likeCard = (req: any, res: Response) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((cardLike) => res.status(OK).send(cardLike))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};

export const dislikeCard = (req: any, res: Response) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardDislike) => res.status(OK).send(cardDislike))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};
