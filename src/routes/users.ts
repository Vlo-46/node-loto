import { Router } from 'express'
import { createUser, getUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller'
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router()

router.get('/', authMiddleware, getUsers)

router.get('/:id', getUser)

router.post('/', authMiddleware, createUser)

router.put('/', authMiddleware, updateUser)

router.delete('/', authMiddleware, deleteUser)

export default router