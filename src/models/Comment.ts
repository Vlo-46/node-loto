import { Schema, model } from 'mongoose'
import { IComment } from "../interfaces/comment";

const CommentSchema = new Schema<IComment>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    poem: {
        type: Schema.Types.ObjectId,
        ref: 'Poem'
    },
    comment: { type: String, required: true },
}, { timestamps: true });

export const Comment = model('Comment', CommentSchema)