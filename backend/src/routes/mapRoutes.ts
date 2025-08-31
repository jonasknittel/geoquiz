import { Router } from "express";
import { getAllMaps, getMapById } from "../controller/mapController.js";


export const mapRouter:Router = Router();

mapRouter.get('/all', getAllMaps);
mapRouter.get('/:mapId', getMapById);