import bcrypt from 'bcrypt'
import { User } from '../models/User'
import { IUser } from "../interfaces/user";

export default class UserService {
    static async create(data: IUser) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await User.create({
            ...data,
            password: hashedPassword
        })
    }

    static async update(data: Partial<IUser>) {
        return User.findByIdAndUpdate(data._id, {...data}, {
            new: true,
            returnOriginal: false
        });
    }

    static async remove(id: string) {
        return User.deleteOne({_id: id});
    }

    static async findById(id: string) {
        return User.findById(id);
    }

    static async findAll() {
        return User.find();
    }

    static async findBy(type: string, email: string) {
        return User.findOne({ [type]: email })
    }
}