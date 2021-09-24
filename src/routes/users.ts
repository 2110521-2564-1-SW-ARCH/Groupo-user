import { Router } from "express"
import userController from "../controllers/users.controller"

const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.get("/refresh", userController.refreshToken);

export default userRouter;