import { Router } from "express";
import { getGameById, getGamesByUser, createGame } from "../controller/gameController.js";


export const gameRouter:Router = Router();

gameRouter.get('/me', getGamesByUser);
// gameRouter.get('/:mapId', getGamesByMap);
gameRouter.get('/:gameId', getGameById);
gameRouter.post('/', createGame);