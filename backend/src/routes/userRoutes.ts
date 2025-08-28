import { Router } from "express";
import { getCurrentUser, updateCurrentUserName, deleteCurrentUser } from "../controller/userController.js";

const userRouter:Router = Router();

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', updateCurrentUserName);
userRouter.delete('/me', deleteCurrentUser);

export default userRouter;