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

    static async update(id: string, data: Partial<IUser>) {
        return await User.findOneAndUpdate({ _id: id }, { ...data }, {
            returnOriginal: false
        })
    }

    static async remove(id: string) {
        return await User.deleteOne({ _id: id })
    }

    static async findById(id: string) {
        return await User.findById(id);
    }

    static async findAll() {
        return await User.find();
    }
}