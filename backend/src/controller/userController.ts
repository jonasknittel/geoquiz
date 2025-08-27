import type { Request, Response } from "express";
import prisma from "../db/client.js";

export const getCurrentUser = async (req:Request, res:Response) => {
    const id = Number(req.cookies.userId);
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    res.send(user);
}