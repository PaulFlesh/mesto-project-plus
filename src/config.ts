import 'dotenv/config';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-strong-secret';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mestodb';
export const PORT = process.env.PORT || 3000;
