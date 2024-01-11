import { IComment } from "../interfaces/comment";
import { Comment } from "../models/Comment";

export default class CommentService {
    static async create(data: IComment) {
        return await Comment.create({ ...data })
    }

    static async remove(id: string) {
        return await Comment.deleteOne({ _id: id })
    }

    static async getComments(id: string) {
        return await Comment.find({ poem: id })
    }
}