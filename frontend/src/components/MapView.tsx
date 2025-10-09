import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import type { GeoJsonObject, Feature, Geometry } from "geojson";

import L, { Layer } from 'leaflet';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Slider } from 'primereact/slider';
import type { Game } from "../models/Game";
import { PathPreview } from "./PathPreview";
import { Recorder } from "./Recorder";
import { MapBounds } from "./MapBounds";
import { Tooltip } from "react-tooltip";


export const MapView = () => {
    const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
    const [ratio, setRatio] = useState<number>(1);
    const [toGuessFeatures, setToGuessFeatures] = useState<string[]>([]);
    const [guessedFeatures, setGuessedFeatures] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("Steiermark");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [finishedGame, setFinishedGame] = useState<Game | null>(null);
    const [size, setSize] = useState<number>(800);

    const features = useRef<string[]>([]);
    const startRef = useRef<number | null>(null);
    const endRef = useRef<number | null>(null);
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

    const buttonQuestion =  (
         <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isPlaying ? (
                <div>{ currentQuestion }</div>
            ) : (
                <Button onClick={() => {startGame(); startRef.current = performance.now();}}>START GAME</Button>
            )}
        </div>
    )

    const sizeSlider = (
        <div style={{width: '200px'}}>
            <Slider 
                value={size} 
                onChange={(e) => setSize(e.value as number)}
                min={100}
                max={2000}
                step={50}
            />
        </div>
    )

    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center"
        }}>
        <div style={{
            width: '100%'
        }}>
        <Menubar 
            start={buttonQuestion}
            end={sizeSlider}
            style={{ width: '100%'}}
            />
        
        </div>
        
            <div id="map-container-wrapper" style={{height: size, width: size*1.88 }}>
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
                    <Recorder active={isPlaying} onData={(mP) => {setFinishedGame(mP)}}></Recorder>
                    { !isPlaying && <PathPreview game={finishedGame} />}
                    <MapBounds size={size} data={geoData} changeLatLngRatio = {(ratio) => {setRatio(ratio)}} />
                </MapContainer>
            </div>
            <Tooltip 
                anchorSelect="#map-container-wrapper" 
                content={currentQuestion} 
                float={true}
                place="top"
                style={{zIndex: 999}}
            />
        </div>
    )
}