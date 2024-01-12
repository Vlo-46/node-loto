import { Poem } from "../models/Poem";
import { IPoem } from "../interfaces/poem";
import {Model} from "mongoose";

export default class PoemService {
    static async findAll() {
        return Poem.find()
          .populate('author')
          .populate('comment');
    }

    static async findById(id: string) {
        const poem = await Poem.findById(id)
          .populate({
              path: 'author',
              model: 'User',
              select: 'name lastName email',
          } as any)
          .populate({
              path: 'comments',
              populate: {
                  path: 'author',
                  model: 'User',
                  select: 'name lastName email',
              }
          } as any)
          .exec();

        if (!poem) return null

        return poem
    }

    static async create(data: IPoem) {
        return await Poem.create({ ...data });
    }

    static async update(id: string, data: Partial<IPoem>) {
        return Poem.findOneAndUpdate({_id: id}, {...data}, {
            returnOriginal: false
        });
    }

    static async remove(id: string) {
        return Poem.deleteOne({_id: id});
    }

    static async likeOrDislike(data: { like?: boolean, dislike?: boolean, poem_id: string }) {
        const poem = await this.findById(data.poem_id)
        if (poem) {
            data.hasOwnProperty('like') ? poem.like = poem.like + 1 : poem.dislike = poem.dislike + 1
            await poem.save()
            return poem;
        }
        return null
    }
}