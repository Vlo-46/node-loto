import { Request, Response } from 'express'
import AuthService from "../services/auth.service";

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

export {
    loginHandler,
    registerHandler,
    logoutHandler
}