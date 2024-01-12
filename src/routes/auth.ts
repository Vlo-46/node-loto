import { Router } from 'express'
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller";

const router = Router()

router.post('/login', loginHandler)

router.post('/register', registerHandler)

router.post('/logout', logoutHandler)

export default router