import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from 'react-leaflet-geoman-v2';
import Popup from "./PopupHandler";
import ReactDOM from "react-dom/client";

const DrawComponent = ({ onGeoJSONChange }) => {
  const addNewGeoJSON = (layer) => {
    const id = layer._leaflet_id;
    const geojson = layer.toGeoJSON();

    const featureWithId = {
      ...geojson,
      properties: {
        ...geojson.properties,
        id: id,
      },
    };

    // render popup
    const popupElement = document.createElement('div');
    const root = ReactDOM.createRoot(popupElement);
    root.render(<Popup feature={featureWithId} />);
    layer.bindPopup(popupElement);

    // update langsung ke parent state
    onGeoJSONChange((prevGeoJson) => ({
      ...prevGeoJson,
      features: [...prevGeoJson.features, featureWithId],
    }));
  };

  const handleLayerRemove = (e) => {
    const layer = e.layer;
    const removedId = layer.feature?.properties.id;

    if (removedId) {
      onGeoJSONChange((prevGeoJson) => {
        const updatedFeatures = prevGeoJson.features.filter(
          (feature) => feature.properties?.id !== removedId
        );

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
    <GeomanControls
      options={{
        position: 'topright',
      }}
      globalOptions={{
        continueDrawing: false,
      }}
      onCreate={(e) => addNewGeoJSON(e.layer)}
      onMapRemove={handleLayerRemove}
    />
  );
};

export default DrawComponent;
