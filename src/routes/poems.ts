import { Router } from 'express'
import {addPoem, likeOrDislike, getPoem, getPoems, removePoem, updatePoem} from '../controllers/poem.controller'

const router = Router()

router.get('/', getPoems)

router.get('/:id', getPoem)

router.post('/', addPoem)

router.put('/', updatePoem)

router.delete('/', removePoem)

router.post('/like', likeOrDislike)


export default router