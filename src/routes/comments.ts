import { Router } from 'express'
import { createComment, deleteComment, getComments } from '../controllers/comment.controller'
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.post('/', authMiddleware, createComment)

router.delete('/', authMiddleware, deleteComment)

router.get('/', getComments)

export default router