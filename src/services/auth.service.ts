import UserService from "./user.service";
import { hashPassword, comparePasswords } from '../utils/auth';
import {generateToken} from "../utils/jwt";

export default class AuthService {
    static async login(data) {
        const user = UserService.findBy('email', data.email)
        if (!user) return 'User not found'

        const isPasswordMatch = await comparePasswords(data.password, user.password);
        if (!isPasswordMatch) return 'Incorrect password'

        const token = generateToken({ userId: user.id, email: user.email })

        return {
            user,
            token
        };
    }

    static async register(data) {
        const candidate = UserService.findBy('email', data.email)
        if (candidate) return 'User is exist'

        return  UserService.create(data)
    }

    static async logout() {
        return true
    }
}