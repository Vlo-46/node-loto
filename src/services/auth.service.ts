import UserService from "./user.service";
import { hashPassword, comparePasswords } from '../utils/auth';
import {generateToken} from "../utils/jwt";
import {IUser} from "../interfaces/user";

export default class AuthService {
    static async login(data: {email: string, password: string}) {
        const user = await UserService.findBy('email', data.email)
        if (!user) return 'User not found'

        const isPasswordMatch = await comparePasswords(data.password, user.password);
        if (!isPasswordMatch) return 'Incorrect password'

        const token = generateToken({ userId: user._id, email: user.email })

        return {
            user,
            token
        };
    }

    static async register(data: IUser) {
        const candidate = await UserService.findBy('email', data.email)
        if (candidate) return 'User is exist'

        return  UserService.create(data)
    }

    static async logout() {
        return true
    }
}