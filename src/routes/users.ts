import { Router } from "express"
import userController from "../controllers/users.controller"
import {asyncErrorHandling} from "../error";

const userRouter = Router();

userRouter.post("/register", asyncErrorHandling(userController.register));
userRouter.post("/login", asyncErrorHandling(userController.login));
userRouter.get("/refresh", asyncErrorHandling(userController.refreshToken));

export default userRouter;