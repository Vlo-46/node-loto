import { Router } from 'express'
import { createUser, getUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller'

const router = Router()

router.get('/', getUsers)

router.get('/:id', getUser)

router.post('/', createUser)

router.put('/', updateUser)

router.delete('/', deleteUser)

export default router