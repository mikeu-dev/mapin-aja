"use client"; // pastikan ini ada supaya Next.js tahu ini komponen client

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Import library Leaflet **hanya di client**
const L = dynamic(() => import("leaflet"), { ssr: false });
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// Import komponen internal
import Popup from "./PopupHandler";
import FitBoundsComponent from "./FitBound";
import LeafletControlGeocoder from "./Geocoder";
import DrawComponent from "./DrawMap";

import { MapContainer, TileLayer, FeatureGroup, ScaleControl, useMap } from "react-leaflet";
import { createRoot } from "react-dom/client";

const PopupHandlerClient = ({ geoJsonData }) => {
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

const MapComponent = ({ geoJsonData }) => {
  // Konfigurasi icon default Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

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
      <LeafletControlGeocoder />
      <ScaleControl position="bottomleft" />
      <FeatureGroup>
        <PopupHandlerClient geoJsonData={geoJsonData} />
        <DrawComponent onGeoJSONChange={geoJsonData} />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
