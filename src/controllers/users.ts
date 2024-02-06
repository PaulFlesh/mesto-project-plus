import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../models/user';
import { OK } from '../constants/codes';
import NotFound from '../errors/NotFound';
import BadRequest from '../errors/BadRequest';
import Conflict from '../errors/Conflict';
import Unathorized from '../errors/Unauthorized';

const { JWT_SECRET } = require('../config');

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  user.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  user.findById(req.user._id).orFail()
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new NotFound('Передан невалидный _id'));
      } else {
        next(err);
      }
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  user.findById(req.user._id).orFail()
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new NotFound('Передан невалидный _id'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userInfo) => res.status(OK).send({
      _id: userInfo._id,
      name: userInfo.name,
      about: userInfo.about,
      avatar: userInfo.avatar,
      email: userInfo.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInfo) => res.status(OK).send(userInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('ППереданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((avatarInfo) => res.status(OK).send(avatarInfo))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => { // any
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((userInfo: any) => {
      const token = jwt.sign({ _id: userInfo._id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
      res.cookie('userId', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .send(userInfo.toJSON());
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.name === 'HttpErrorResponse') {
        next(new Unathorized('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};
