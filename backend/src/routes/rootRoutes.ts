import { Router } from "express";
import userRouter from "./userRoutes.js";
import { gameRouter } from "./gameRoutes.js";
import { mapRouter } from "./mapRoutes.js";

const rootRouter: Router = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/games', gameRouter);
rootRouter.use('/maps', mapRouter);

export default rootRouter;