import { Schema, model, Model } from 'mongoose'
import { IPoem } from "../interfaces/poem";

const PoemSchema = new Schema<IPoem>(
  {
      author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
      },
      comments: [
          {
              type: Schema.Types.ObjectId,
              ref: 'Comment',
          },
      ],
      title: { type: String, required: true },
      content: { type: String, required: true, unique: true },
      like: {
          type: Number,
          default: 0,
      },
      dislike: {
          type: Number,
          default: 0,
      },
  },
  { timestamps: true }
);

export const Poem:Model<IPoem> = model('Poem', PoemSchema)