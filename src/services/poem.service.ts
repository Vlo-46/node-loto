import { Poem } from "../models/Poem";
import {IPoem} from "../interfaces/poem";

export default class PoemService {
    static async findAll() {
        return await Poem.find()
          .populate('author')
          .populate('comment')
    }

    static async findById(id: string) {
        return await Poem.findById(id);
    }

    static async create(data: IPoem) {
        return await Poem.create({ ...data });
    }

    static async update(id: string, data: Partial<IPoem>) {
        return await Poem.findOneAndUpdate({ _id: id }, { ...data }, {
            returnOriginal: false
        })
    }

    static async remove(id: string) {
        return await Poem.deleteOne({ _id: id })
    }

    static async likeOrDislike(data: { like?: boolean, dislike?: boolean, poem_id: string }) {
        const poem = await this.findById(data.poem_id)
        if (poem) {
            data.hasOwnProperty('like') ? poem.like = poem.like + 1 : poem.dislike = poem.dislike + 1
            await poem.save()
            return poem;
        }
        return 'Poem not found'
    }
}