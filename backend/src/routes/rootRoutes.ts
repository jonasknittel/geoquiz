import { Router } from "express";
import userRouter from "./userRoutes.js";

const rootRouter: Router = Router();

rootRouter.use('/user', userRouter);

export default rootRouter;