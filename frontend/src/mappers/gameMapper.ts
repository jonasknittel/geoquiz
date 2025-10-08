import type { GameDTO } from "../DTOs/gameDTO";
import type { Game } from "../models/Game";

// When we receive Game from backend
export const mapToGame = (dto: GameDTO): Game => ({
    id: dto.id,
    score: dto.score,
    map: dto.map,
    mouseCoordinates: dto.mouseCoordinates
})