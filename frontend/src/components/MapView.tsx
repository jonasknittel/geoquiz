import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export const MapView = () => {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/testgeojson/quiz_test.geojson")
        .then((response) => response.json())
        .then(
            (data) => {
                setGeoData(data)
                console.log("GeoJSON geladen:", data)
            }
        )
        .catch((err) => console.error("Failed to load GeoJSON:", err));
    }, []);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <MapContainer   center={[47.5162, 14.5501]} // lat, lng
                            zoom={7} 
                            scrollWheelZoom={false} 
                            style={{ height: '100%', width: '100%' }}
                        >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {geoData && (
                    <>
                        <GeoJSON
                            data={geoData}
                            style={{ color: "black", fillColor: "lightblue", fillOpacity: 0.5 }}
                            
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
};