import type { Map } from "./Map";

export class Game {
    id?: number;
    startTime: Date;
    score?: number;
    map: Map;

    constructor (id: number, startTime: Date, score: number, map: Map) {
        this.id = id;
        this.startTime = startTime;
        this.score = score;
        this.map = map;
    }
}