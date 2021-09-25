import { Router } from "express";
import {catcher} from "groupo-shared-service/apiutils/errors";
import userController from "../controllers/users.controller";

const userRouter = Router();

userRouter.post("/register", catcher(userController.register));
userRouter.post("/login", catcher(userController.login));
userRouter.get("/refresh", catcher(userController.refreshToken));

export default userRouter;
