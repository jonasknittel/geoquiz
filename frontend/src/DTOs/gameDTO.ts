import type { Map } from "../models/Map";
import type { MouseCoordinates } from "../models/MouseCoordinates";

export interface GameDTO {
  id?: number;
  score?: number;
  map?: Map;
  mouseCoordinates?: MouseCoordinates[];
}
