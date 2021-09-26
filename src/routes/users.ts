import { Router } from "express";
import * as UserController from "../controllers/users.controller";

const userRouter = Router();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.get("/refresh", UserController.refreshAccessToken);

export default userRouter;
