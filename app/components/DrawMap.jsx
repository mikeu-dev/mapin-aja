
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from 'react-leaflet-geoman-v2';
import Popup from "./PopupHandler";
import ReactDOM from "react-dom/client";
import { useState } from "react";

const DrawComponent = ({ onGeoJSONChange }) => {
    const [geoJson, setGeoJson] = useState({ type: "FeatureCollection", features: [] });

    const addNewGeoJSON = (layer) => {
        const id = layer._leaflet_id;
        const geojson = layer.toGeoJSON();
        console.log("geojson:", geojson);
        const featureWithId = {
            ...geojson,
            properties: {
                ...geojson.properties,
                id: id,
            },
        };

        const popupElement = document.createElement('div'); // Buat elemen DOM untuk popup
        const root = ReactDOM.createRoot(popupElement);  // Ganti dengan createRoot
        root.render(<Popup feature={featureWithId} />);  // Render ke elemen

        layer.bindPopup(popupElement);

        setGeoJson((prevGeoJson) => ({
            ...prevGeoJson,
            features: [...prevGeoJson.features, featureWithId],
        }));
    };

    const handleLayerRemove = (e) => {
        const layer = e.layer;
        console.log("geojson remove: ", layer);

        const removedId = layer.feature?.properties.id;
        console.log("find id: ", removedId);

        if (removedId) {
            onGeoJSONChange((prevGeoJson) => {
                const updatedFeatures = prevGeoJson.features.filter(
                    (feature) => feature.properties?.id !== removedId
                );

                console.log("Updated Features After Removal:", updatedFeatures);

                return {
                    ...prevGeoJson,
                    features: updatedFeatures,
                };
            });
        } else {
            console.warn("Feature ID not found. Removal skipped.");
        }
    };

    return (
        <>
            <GeomanControls
                options={{
                    position: 'topright',
                }}
                globalOptions={{
                    continueDrawing: false,
                }}
                onCreate={(e) => {
                    const layer = e.layer;
                    addNewGeoJSON(layer);
                }}
                onMapRemove={handleLayerRemove}
            />
        </>
    );
};

export default DrawComponent;
