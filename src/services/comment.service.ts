import { Comment } from "../models/Comment";
import { User}  from "../models/User";
import { Poem } from "../models/Poem";
import { IComment } from "../interfaces/comment";

export default class CommentService {
    static async create(data: IComment) {
        const user = await User.findById(data.author);
        if (!user) return { error: "User not found" }

        const poem = await Poem.findById(data.poem);
        if (!poem) return { error: "Poem not found" }

        const comment = new Comment({
            author: user._id,
            poem: poem._id,
            comment: data.comment
        });
        await comment.save();

        poem.comments.push(comment._id);
        await poem.save();

        return comment
    }

    static async remove(id: string) {
        return Comment.deleteOne({_id: id});
    }

    static async getComments(id: string) {
        return Comment.find({poem: id});
    }
}