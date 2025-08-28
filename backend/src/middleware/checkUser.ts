import type { Request, Response, NextFunction } from "express";
import prisma from "../db/client.js";

export async function checkUser(req: Request, res: Response, next: NextFunction) {

    if (!req.cookies.userId) {
        const user = await prisma.user.create({
            data: {
                name: Math.random().toString()
            }
        });

        // Set cookie
        res.cookie("userId", user.id);
        res.send(user);
    } else {
        // So request call isn't terminated
        next();
    }
}