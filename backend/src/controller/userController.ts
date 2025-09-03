import type { Request, Response } from "express";
import prisma from "../db/client.js";

export const getCurrentUser = async (req:Request, res:Response) => {
    
    const id = Number(req.cookies.userId);
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid user ID in cookie." });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    console.log("getCurrentUser(): ", req.cookies.userId);
    res.send(user);
}

// Only updates NAME, games are added at /api/games
export const updateCurrentUserName = async (req:Request, res:Response) => {
    const userId = Number(req.cookies.userId);

    const newName = req.body.user.name;

    const newUser = await prisma.user.update({
        where: { id: userId},
        data: { 
            name: newName
         }
    });

    res.send(newUser);
}

export const deleteCurrentUser = async (req:Request, res:Response) => {
    const userId = Number(req.cookies.userId);

    const deletedUser = await prisma.user.delete({
        where: {
            id: userId
        }
    });

    res.clearCookie("userId");
    res.json({ success: true, message: "Cookie gelöscht" });
}