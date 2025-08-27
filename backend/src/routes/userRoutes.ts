import { Router } from "express";
import { getCurrentUser } from "../controller/userController.js";

const userRouter:Router = Router();

userRouter.get('/me', getCurrentUser);

export default userRouter;