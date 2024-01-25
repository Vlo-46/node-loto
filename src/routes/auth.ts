import { Router } from 'express'
import { loginHandler, logoutHandler, registerHandler, me } from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router()

router.post('/login', loginHandler)

router.post('/register', registerHandler)

router.post('/logout', logoutHandler)

router.get('/me', authMiddleware, me)

export default router