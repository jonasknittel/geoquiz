import { useEffect } from "react";
import type { Game } from "../models/Game";
import { CircleMarker, Polyline } from "react-leaflet";

// Needs a Game object and displays its MouseCoordinates
export const PathPreview = ({game}: {game?: Game | null}) => {
    useEffect(() => {
        if (game === null) {
            console.log('game is null');
        } else {
            console.log(game);
        }
        
    }, [game]);

    if (!game || !game.mouseCoordinates || game.mouseCoordinates.length === 0) {
        return null;
    }

    const positions = game.mouseCoordinates.map((c) => [c.lat, c.lng] as [number, number]);
    return (
        <>
        <Polyline
            positions={positions}
            pathOptions={{color: "red", weight: 3}}
            pane = 'overlayPane'
        />
        {game.mouseCoordinates.map((c, i) => (
        <CircleMarker
            key={i}
            center={[c.lat, c.lng]}
            radius={5}
            pathOptions={{
                color: c.click === false ? "blue" : "yellow",
                weight: c.click === false ? 0.5 : 1,
                fillColor: c.click === false ? "blue" : "yellow",
                fillOpacity: c.click === false ? 0 : 1
            }}
        />
        ))}
        </>
    )
}