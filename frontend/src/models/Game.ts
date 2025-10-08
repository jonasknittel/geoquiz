import type { Map } from "./Map";
import type { MouseCoordinates } from "./MouseCoordinates";

export class Game {
    id?: number;
    score?: number;
    map?: Map;
    mouseCoordinates?: MouseCoordinates[];

    constructor (id: number, score: number, map: Map) {
        this.id = id;
        this.score = score;
        this.map = map;
    }

    toString(): string {
    return `Game { 
      id: ${this.id ?? "n/a"}, 
      score: ${this.score ?? "n/a"}, 
      map: ${this.map ? this.map.toString?.() ?? "[Map object]" : "n/a"}, 
      mouseCoordinates: ${this.mouseCoordinates ? this.mouseCoordinates.length : 0} points 
    }`;
  }
}