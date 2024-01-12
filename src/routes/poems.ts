import { Router } from 'express'
import { addPoem, likeOrDislike, getPoem, getPoems, removePoem, updatePoem } from '../controllers/poem.controller'
import { authMiddleware }  from "../middlewares/auth.middleware";

const router = Router()

router.get('/', getPoems)

router.get('/:id', getPoem)

router.post('/', [authMiddleware], addPoem)

router.put('/', authMiddleware, updatePoem)

router.delete('/', authMiddleware, removePoem)

router.post('/like', likeOrDislike)


export default router