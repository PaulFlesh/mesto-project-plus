import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import NotFound from './errors/NotFound';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import errorsMiddleware from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';
import { login, createUser } from './controllers/users';
import { createUserValidation, loginValidation } from './utils/validation';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/cards', cardRouter);
app.use('/users', userRouter);

// delete after review
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);
