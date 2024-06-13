import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { GeoJsonObject } from "geojson";

interface MapComponentProps {
  onGeoJsonChange: (geojsonData: GeoJsonObject | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onGeoJsonChange }) => {
  useEffect(() => {
    // Fix leaflet's default icon issue
    delete L.Icon.Default.prototype.options.iconUrl;
    delete L.Icon.Default.prototype.options.iconRetinaUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const handleCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;
    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
      handleGeoJsonChange();
    }
  };

  const handleDeleted = () => {
    handleGeoJsonChange();
  };

  const handleGeoJsonChange = () => {
    if (featureGroupRef.current) {
      const geojsonData = featureGroupRef.current.toGeoJSON() as GeoJsonObject;
      onGeoJsonChange(geojsonData);
    } else {
      onGeoJsonChange(null);
    }
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "665px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onDeleted={handleDeleted}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
