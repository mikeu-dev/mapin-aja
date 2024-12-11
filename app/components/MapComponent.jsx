// src/components/MapComponent.jsx
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import FitBoundsComponent from "./FitBound";
import LeafletControlGeocoder from "./Geocoder";
import DrawComponent from "./DrawMap";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

// Override default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ geoJsonData, onGeoJSONChange }) => {
  const [map, setMap] = useState(null);
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);

  useEffect(() => {
    if (map) {
      console.log("Peta sudah siap:", map);
    }
  }, [map]);

  return (
    <MapContainer
      whenCreated={(mapInstance) => {
        setMap(mapInstance);
      }}
      center={[-0.7893, 113.9213]}
      zoom={5}
      style={{ height: "665px", width: "100%" }}
      doubleClickZoom={false}
      dragging={true}
    >

      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoJsonData} />
      <FitBoundsComponent geoJsonData={geoJsonData} geoJsonLayer={geoJsonLayer} />
      <LeafletControlGeocoder />
      <DrawComponent onGeoJSONChange={onGeoJSONChange} />

    </MapContainer>
  );
};

export default MapComponent;
