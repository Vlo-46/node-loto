import { Model, Schema, model } from 'mongoose'
import { IComment } from "../interfaces/comment";

const CommentSchema = new Schema<IComment>(
  {
      author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
      },
      poem: {
          type: Schema.Types.ObjectId,
          ref: 'Poem',
          required: true,
      },
      comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment: Model<IComment> = model('Comment', CommentSchema)