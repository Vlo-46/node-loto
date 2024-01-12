import { IUser } from "./user";
import { Types } from 'mongoose'

export interface IComment {
    _id?: Types.ObjectId;
    author: IUser['_id'];
    poem: Types.ObjectId;
    comment: string;
}