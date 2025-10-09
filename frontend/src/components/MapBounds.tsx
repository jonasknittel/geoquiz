import type { GeoJsonObject } from "geojson";
import { useEffect, useState } from "react";
import { Rectangle, useMap } from "react-leaflet";
import L, { Layer } from 'leaflet';

export const MapBounds = ({data, changeLatLngRatio}: { data: GeoJsonObject | null, changeLatLngRatio: (ratio: number) => void}) => {
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