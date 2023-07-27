import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string, password: string // eslint-disable-line
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const UserSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlenght: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar: string) => validator.isURL(avatar, { protocols: ['http', 'https'] }),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', UserSchema);
