import { Request, Response } from 'express'
import { User } from '../models/User'
import UserService from "../services/user.service";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response)  => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({email});

        if (candidate) return res.send('The candidate is exist');

        const newUser = await UserService.create(req.body)

        return res.send(newUser);
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await UserService.findById(req.params.id)
        return res.send(user)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.findAll()
        return res.send(users)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const data = await UserService.remove(req.body.id)
        return res.send(data)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { data } = req.body

        if (data.hasOwnProperty('password')) {
            data.password = bcrypt.hash(data.password, 10)
        }

        const user = await UserService.update(data)

        return res.send({updated: !!user, user})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}
