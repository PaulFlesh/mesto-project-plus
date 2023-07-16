import { Request, Response } from 'express';
import user from '../models/user';
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} from '../constants/codes';

export const getUsers = (req: Request, res: Response) => {
  user.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: res.statusMessage }));
};

export const getUser = (req: Request, res: Response) => {
  user.findById(req.params.userId)
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};

export const updateUser = (req: any, res: Response) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: res.statusMessage });
      }
    });
};

export const updateUserAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((avatarInfo) => res.status(OK).send(avatarInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(BAD_REQUEST).send({ message: res.statusMessage });
      }
    });
};
