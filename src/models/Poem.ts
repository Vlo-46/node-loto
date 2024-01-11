import { Schema, model } from 'mongoose'
import { IPoem } from "../interfaces/poem";

const PoemSchema = new Schema<IPoem>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    title: { type: String, required: true },
    content: { type: String, required: true, unique: true },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Poem = model('Poem', PoemSchema)