import { useEffect, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap, GeoJSON } from "react-leaflet"
import type { GeoJsonObject, Feature, Geometry, FeatureCollection } from "geojson";
import 'leaflet/dist/leaflet.css';
import L, { Layer } from 'leaflet';
import { Button } from 'primereact/button';

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

export const MapView = () => {
    const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
    const [ratio, setRatio] = useState<number>(1);
    const [features, setFeatures] = useState<string[]>([]);
    const [guessedFeatures, setGuessedFeatures] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("Steiermark");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

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

                setFeatures(namesArray); 
            }
            setGeoData(data);

        })
        .catch((err) => console.error("Failed to load GeoJSON:", err));
        
    }, []);

    const changeCurrentQuestion = () => {

        const featuresUpdated = features.filter((name) => name !== currentQuestion)

        setGuessedFeatures([...guessedFeatures, currentQuestion]);

        setFeatures(featuresUpdated);

        setCurrentQuestion(featuresUpdated[Math.floor(Math.random() * featuresUpdated.length)])
    }

    const getFeatureStyle = (feature: Feature<Geometry, any> | undefined) => {
        const areaName = feature?.properties?.name;

        if (features.includes(areaName)) {
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
                console.log( currentQuestion + name);
                if (currentQuestion === name) {
                    changeCurrentQuestion();
                }
            }
        },
        )
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
        { isPlaying ? <div>{ currentQuestion }</div> : <Button onClick={() => setIsPlaying(true)}>START GAME</Button>}
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
                </MapContainer>
            </div>
        </div>
    )
}