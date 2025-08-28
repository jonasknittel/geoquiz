import { Router } from "express";
import userRouter from "./userRoutes.js";
import { gameRouter } from "./gameRoutes.js";

const rootRouter: Router = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/games', gameRouter);

export default rootRouter;