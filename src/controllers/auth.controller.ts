import { Request, Response } from 'express'
import AuthService from "../services/auth.service";
import {AuthenticatedRequest} from "../middlewares/auth.middleware";
import UserService from "../services/user.service";

const loginHandler = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const user = await AuthService.login({ email, password });

        return res.send(user)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const registerHandler = async (req: Request, res: Response) => {
    try {
        const candidate = await AuthService.register({ ...req.body })
        return res.send(candidate)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const logoutHandler = async (req: Request, res: Response) => {
    try {
        return true
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const me = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(401).json({ message: 'Unauthorized - Missing token', error: true });
        }

        const user = await UserService.findById(userData.userId);
        if (!user) {
            return res.status(401).json({ message: 'User is not exist', error: true })
        }

        return res.status(200).send(user)
    } catch (e) {
        console.log('something went wrong')
    }
}

export {
    loginHandler,
    registerHandler,
    logoutHandler,
    me
}