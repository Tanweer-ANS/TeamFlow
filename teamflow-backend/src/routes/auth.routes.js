import express from "express"
import validate from "../middleware/validate.middleware.js"
import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js"
import { register, login, refresh, logout } from "../controllers/auth.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"      


const router = express.Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", refresh)
router.post("/logout", authMiddleware, logout)

export default router