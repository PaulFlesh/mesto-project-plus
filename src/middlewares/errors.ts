import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR } from '../constants/codes';

export default (
  err: { statusCode: number, message: string },
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
