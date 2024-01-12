import { Types } from 'mongoose'
import { IUser } from "./user";

export interface IPoem {
    _id?: Types.ObjectId;
    author: IUser['_id'];
    comments: Types.ObjectId[];
    title: string;
    content: string;
    like: number;
    dislike: number;
}