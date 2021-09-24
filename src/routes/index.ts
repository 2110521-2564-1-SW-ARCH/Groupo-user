import { Router } from "express";
import userRouter from "./users";

const routes = Router();

routes.use('/user', userRouter);

export default routes;