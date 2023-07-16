import express, { Response } from 'express';
import mongoose from 'mongoose';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res: Response, next) => {
  req.user = { _id: '6367cf71688a3a1d1059fc31' };
  next();
});

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.listen(PORT);
