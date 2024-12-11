// src/components/FitBoundsComponent.jsx
import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const FitBoundsComponent = ({ geoJsonData, geoJsonLayer }) => {
    const mapInstance = useMap();

    useEffect(() => {
        if (mapInstance && geoJsonData) {
            // Hapus layer lama jika ada
            if (geoJsonLayer) {
                mapInstance.removeLayer(geoJsonLayer);
            }

            // Menambahkan layer GeoJSON baru
            if (geoJsonData.features.length > 0) {
                const newGeoJsonLayer = L.geoJSON(geoJsonData).addTo(mapInstance);
                const newBounds = newGeoJsonLayer.getBounds();
                mapInstance.fitBounds(newBounds, { animate: true });
            }
        }
    }, [mapInstance, geoJsonData, geoJsonLayer]);

    return null;
};

export default FitBoundsComponent;
