import type { GameDTO } from "../DTOs/gameDTO";
import { mapToGame } from "../mappers/gameMapper";
import type { Game } from "../models/Game";
import { api } from "./api";

export const getMyGamesApi = async(): Promise<Game[]> => {
    const res = await api.get<GameDTO[]>("/games/me");

    return res.data.map(mapToGame);
}

export const postGameApi = async(dto: GameDTO): Promise<Game> => {
    const res = await api.post<GameDTO>("/games", dto);

    return mapToGame(res.data);
}