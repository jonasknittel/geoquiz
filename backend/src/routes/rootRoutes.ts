import { Router } from "express";
import userRouter from "./userRoutes.js";

const rootRouter: Router = Router();

rootRouter.use('/users', userRouter);

export default rootRouter;