import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  ScaleControl,
  Popup,
} from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import FitBoundsComponent from "./FitBound";
import LeafletControlGeocoder from "./Geocoder";
import DrawComponent from "./DrawMap";

// Konfigurasi icon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ geoJsonData }) => {
  return (
    <MapContainer
      center={[-0.7893, 113.9213]}
      zoom={5}
      style={{ height: "665px", width: "100%" }}
      preferCanvas={true}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© 2024 Mikeu. All rights reserved."
      />
      {/* Fit bounds untuk GeoJSON */}
      {geoJsonData && <FitBoundsComponent geoJsonData={geoJsonData} />}
      {/* Geocoder Control */}
      <LeafletControlGeocoder />
      {/* Scale Control */}
      <ScaleControl position="bottomleft" />
      <FeatureGroup>
        {/* Tambahkan GeoJSON */}
        {geoJsonData && console.log("Data GeoJSON:", geoJsonData)}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
          />
        )}
        {/* Draw Component */}
        <DrawComponent onGeoJSONChange={geoJsonData} />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
