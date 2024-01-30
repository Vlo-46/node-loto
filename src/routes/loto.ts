import { Router } from 'express'
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router()

router.post('/room')

export default router