import type { Request, Response } from "express";
import prisma from "../db/client.js";

export const getGamesByUser = async (req:Request, res:Response) => {
    const userId = Number(req.cookies.userId);

    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const games = await prisma.game.findMany({
        where: {
            userId: userId
        }
    });

    res.send(games);
}

export const getGamesByMap = async (req:Request, res:Response) => {
    const mapId = Number(req.params.mapId);

    if (isNaN(mapId)) return res.status(400).json({ error: "Invalid mapId" });

    const games = await prisma.game.findMany({
        where: {
            mapId: mapId
        }
    });

    res.send(games);
}

// CRUD
export const getGameById = async (req:Request, res:Response) => {
    const gameId = Number(req.params.gameId);

    if (isNaN(gameId)) return res.status(400).json({ error: "Invalid gameId" });

    const games = await prisma.game.findMany({
        where: {
            id: gameId
        }
    });

    res.send(games);
}

export const getFullGameById = async (req:Request, res:Response) => {
    const gameId = Number(req.params.gameId);

    if (isNaN(gameId)) return res.status(400).json({ error: "Invalid gameId" });

    const games = await prisma.game.findMany({
        where: {
            id: gameId
        },
        include: {
            mouseMeasurements: true
        }
    });

    res.status(200).json(games);
}

export const createGame = async (req:Request, res:Response) => {
    const game = req.body.game;
    const userId = Number(req.cookies.userId);

    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const createdGame = prisma.game.create({
        data: {
            userId: userId,
            mapId: Number(game.mapId),
            startTime: new Date(game.startTime),
            score: Number(game.score),
            mouseMeasurements: { 
                create: game.mouseMeasurements 
            }
        },
        include: { mouseMeasurements: true },
    });
    res.send(createdGame);
}
/**
 * 
 * export const updateGame = async (req:Request, res:Response) => {
 * }
 * 
 */


export const deleteGame = async (req:Request, res:Response) => {
    const gameId = Number(req.params.gameId);

    const game = await prisma.game.delete({
        where: {
            id: gameId
        }
    });
}