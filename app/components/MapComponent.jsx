import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import Popup from "./PopupHandler";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  ScaleControl,
  useMap,
} from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import FitBoundsComponent from "./FitBound";
import LeafletControlGeocoder from "./Geocoder";
import DrawComponent from "./DrawMap";
import { createRoot } from "react-dom/client";

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

const PopupHandler = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !geoJsonData || geoJsonData.features.length === 0) return;

    const geoJsonLayer = new L.GeoJSON(geoJsonData, {
      onEachFeature: (feature, layer) => {
        const popupElement = document.createElement("div");

        createRoot(popupElement).render(
          <Popup
            feature={feature}
            onSave={(feat, newProps) => {
              feat.properties = newProps;
              if (feat.geometry.type === "Polygon") {
                layer.setStyle({
                  color: newProps.strokeColor || "#000",
                  weight: newProps.weight || 2,
                  fillColor: newProps.fillColor || "#00ff00",
                  fillOpacity: newProps.opacity || 0.6,
                });
              }
              console.log("Updated feature:", feat);
            }}
            onDelete={() => {
              layer.remove();
              console.log("Feature deleted");
            }}
          />
        );

        layer.bindPopup(popupElement);
      },
    });

    geoJsonLayer.addTo(map);

    return () => {
      geoJsonLayer.remove();
    };
  }, [map, geoJsonData]);

  return null;
};

const MapComponent = ({ geoJsonData, setGeoJsonData }) => {
  return (
    <MapContainer
      center={[-0.7893, 113.9213]}
      zoom={5}
      style={{ height: "92vh", width: "100%" }}
      preferCanvas={true}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© 2024 Mikeu. All rights reserved."
      />
      {geoJsonData && <FitBoundsComponent geoJsonData={geoJsonData} />}
      <LeafletControlGeocoder onSelect={(feature) => {
        if (feature) {
          setGeoJsonData({
            type: "FeatureCollection",
            features: [feature],
          });
        } else {
          setGeoJsonData({
            type: "FeatureCollection",
            features: [],
          });
        }
      }} />
      <ScaleControl position="bottomleft" />
      <FeatureGroup>
        <PopupHandler geoJsonData={geoJsonData} />
        <DrawComponent
          onGeoJSONChange={setGeoJsonData}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
