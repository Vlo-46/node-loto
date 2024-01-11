import { Router } from 'express'
import { createComment, deleteComment, getComments } from '../controllers/comment.controller'

const router = Router()

router.post('/', createComment)

router.delete('/', deleteComment)

router.get('/', getComments)

export default router