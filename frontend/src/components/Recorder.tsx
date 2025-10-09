import { useCallback, useEffect, useRef } from "react";
import type { GameDTO } from "../DTOs/gameDTO";
import { postGameApi } from "../api/GameApi";
import { useMapEvent, useMapEvents } from "react-leaflet";
import type { MouseCoordinates } from "../models/MouseCoordinates";

type RecorderProps = {
    active: boolean;
    onData: (data: MouseCoordinates[]) => void;
}

export const Recorder = ({ active, onData }: {active: boolean, onData: (data:any) => void }) => {
    const currentMousePosRef = useRef<MouseCoordinates>(null); 
    const mousePathRef = useRef<MouseCoordinates[]>([]); 
    const intervalRef = useRef<number | null>(null);

    useMapEvents({
        mousemove: (e) => {
            currentMousePosRef.current = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                time: performance.now(),
                click: e.originalEvent.buttons === 1,
            };
        },
        mouseout: () => {
            currentMousePosRef.current = null; 
        }
    });

     const sendData = useCallback(async () => {
        if (mousePathRef.current.length > 0) {
            const dto: GameDTO = {score: 100, mouseCoordinates: mousePathRef.current}
            const apiAnswer = await postGameApi(dto);
            console.log("Game finished api answer: ", apiAnswer);
            onData(apiAnswer);
        }
        mousePathRef.current = []; 
    }, [onData]);

    useEffect(() => {

        const cleanup = () => {
            if (intervalRef.current) {
                console.log('Cleanup: Stopping interval.')
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        if (active) {
            if (intervalRef.current !== null) {
                return;
            }

            intervalRef.current = window.setInterval(() => {
                const currentPos = currentMousePosRef.current;
                if (currentPos) {
                    mousePathRef.current.push(currentPos);
                    console.log(active);
                }
            }, 10);

        } else {
            console.log('<Recorder/> cleanup');
            cleanup();
            sendData(); 
            return;
        }

        
        return cleanup;
    }, [active]); 

    return null;
}