import mongoose from 'mongoose';

interface ICard {
  name: string,
  link: string,
  owner: any,
  likes: any,
  createdAt: Date,
}

const CardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', CardSchema);
