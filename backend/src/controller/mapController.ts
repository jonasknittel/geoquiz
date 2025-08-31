import type { Request, Response } from "express";
import prisma from '../db/client.js';

export const getAllMaps = async (req:Request, res:Response) => {
    const maps = await prisma.map.findMany({});

    res.status(200).json(maps);
};

export const getMapById = async (req:Request, res:Response) => {
    const mapId = Number(req.params.mapId);
    if (!mapId) {
        return res.status(400).send('Map ID is missing or invalid');
    }

    const map = await prisma.map.findUnique({
        where: {
            id: mapId
        }
    });

    res.status(200).json(map);
}

// Create?
// Edit?
// First with TestData only?