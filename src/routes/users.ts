import { Router } from "express"
import { login, logout, register } from "../controllers/users"

const userRouter = Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)

export default userRouter