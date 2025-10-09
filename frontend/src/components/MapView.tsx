import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap, GeoJSON, useMapEvents, Polyline, CircleMarker } from "react-leaflet"
import type { GeoJsonObject, Feature, Geometry, FeatureCollection } from "geojson";
import 'leaflet/dist/leaflet.css';
import L, { Layer } from 'leaflet';
import { Button } from 'primereact/button';
import { MouseCoordinates } from "../models/MouseCoordinates";
import { postGameApi } from "../api/GameApi";
import type { GameDTO } from "../DTOs/gameDTO";
import type { Game } from "../models/Game";

const MapBounds = ({data, changeLatLngRatio}: { data: GeoJsonObject | null, changeLatLngRatio: (ratio: number) => void}) => {
    const map = useMap();
    const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

    useEffect(() => {
        if (!data) return;

        try {
            const geoJsonLayer = L.geoJSON(data as any); 
            const bounds = geoJsonLayer.getBounds();

            if (bounds.isValid()) {
                map.invalidateSize(true);
                map.fitBounds(bounds, {
                    padding: [10, 10],
                });
                setBounds(bounds);

                // Ratio berechnen
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();

                const nw = L.latLng(ne.lat, sw.lng);

                const widthMeters = nw.distanceTo(ne);
                const heightMeters = nw.distanceTo(sw);

                changeLatLngRatio(widthMeters/heightMeters);
                console.log(widthMeters/heightMeters);
            }
        } catch (error) {
            console.error("Fehler beim Verarbeiten der GeoJSON-Bounds:", error);
        }
    // Die Abhängigkeit sorgt dafür, dass die Karte neu angepasst wird, wenn sich die Daten ändern
    }, [data, map]); 

    return bounds ? (
        <Rectangle
        bounds={bounds}
        pathOptions={{
            color: "red",
            weight: 3,
            fillOpacity: 0,
            dashArray: "5, 5",
            pane: 'tilePane'
        }}
        />
    ) : null;
}

type RecorderProps = {
    active: boolean;
    onData: (data: MouseCoordinates[]) => void;
}

const Recorder = ({ active, onData }: {active: boolean, onData: (data:any) => void }) => {
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

const PathPreview = ({game}: {game?: Game | null}) => {
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
        {positions.map((pos, i) => (
            <CircleMarker
            key={i}
            center={pos}
            radius={4}
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 1 }}
            />
        ))}
        </>
    )
}

export const MapView = () => {
    const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
    const [ratio, setRatio] = useState<number>(1);
    const [toGuessFeatures, setToGuessFeatures] = useState<string[]>([]);
    const [guessedFeatures, setGuessedFeatures] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("Steiermark");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const features = useRef<string[]>([]);
    const startRef = useRef<number | null>(null);
    const endRef = useRef<number | null>(null);
    const finishedGame = useRef<Game>(null);
    const stopRecordMousePosition = useRef<(() => void) | null>(null);

    useEffect(() => {
        fetch("/testgeojson/quiz_test.geojson")
        .then((response) => response.json())
        .then((data: GeoJsonObject) => {
            console.log("Gesamte GeoJSON-Daten (NEU GELADEN):", data);

            if ('features' in data && Array.isArray(data.features)) {
                
                // Fill state features
                console.log("Anzahl der Features:", data.features.length);
                const namesArray = data.features.map(feature => {
                    const name = feature.properties?.name || `Feature ohne Namen (${feature.geometry.type})`;
                    return name;
                });

                features.current = namesArray; 
            }
            setGeoData(data);

        })
        .catch((err) => console.error("Failed to load GeoJSON:", err));
        
    }, []);

    const changeCurrentQuestion = () => {

        const featuresUpdated = toGuessFeatures.filter((name) => name !== currentQuestion)

        if (featuresUpdated.length == 0) {
            if (startRef.current == null) return;
            endRef.current = performance.now();
            const ms = endRef.current - startRef.current;
            const seconds = (ms / 1000).toFixed(3);
            console.log(seconds);

            setIsPlaying(false);
            console.log('changeCurrentQuesiton() ', isPlaying);
            if (stopRecordMousePosition.current !== null) {
                stopRecordMousePosition.current();
            }
        }

        setGuessedFeatures([...guessedFeatures, currentQuestion]);

        setToGuessFeatures(featuresUpdated);

        setCurrentQuestion(featuresUpdated[Math.floor(Math.random() * featuresUpdated.length)])
    }

    const getFeatureStyle = (feature: Feature<Geometry, any> | undefined) => {
        const areaName = feature?.properties?.name;

        if (toGuessFeatures.includes(areaName)) {
            return { color: 'blue' }
        } else {
            return { color: 'green' }
        }
    }

    const onEachFeature = (
        feature: Feature<Geometry, any>, 
        layer: Layer
    ) => {
        const name = feature.properties?.name;
        if (!name) return;

        layer.on({
            click: () => {
                if (currentQuestion === name) {
                    changeCurrentQuestion();
                }
            }
        })
    }


    const startGame = () => {
        const startFeatures = features.current;
        setIsPlaying(true);

        // Fill game
        setToGuessFeatures(startFeatures);
        setGuessedFeatures([]);
        setCurrentQuestion(startFeatures[Math.floor(Math.random() * startFeatures.length)]);
    }

    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center"
        }}>
        <div style={{
            padding: '20px'
        }}>
        { isPlaying ? <div>{ currentQuestion }</div> : <Button onClick={() => {startGame(); startRef.current = performance.now();}}>START GAME</Button>}
        </div>

            <div style={{height: 800, width: 800 * ratio}}>
                <MapContainer
                    style={{width: '100%', height: '100%'}}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    zoomSnap={0} // Necessary for fitBounds()
                    dragging={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    { geoData && 
                        <GeoJSON 
                            data={geoData}
                            key={currentQuestion}
                            onEachFeature={onEachFeature}
                            interactive={true}
                            style={getFeatureStyle}
                        /> 
                    }
                    <MapBounds data={geoData} changeLatLngRatio = {(ratio) => {setRatio(ratio)}} />
                    <Recorder active={isPlaying} onData={(mP) => {finishedGame.current = mP;}}></Recorder>
                    <PathPreview game={finishedGame.current} />
                </MapContainer>
            </div>
        </div>
    )
}