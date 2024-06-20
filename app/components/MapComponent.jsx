import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-draw";

const MapComponent = ({ geoJSON, onGeoJSONChange }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log("Map state updated:", map);

    if (map) {
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          circle: false,
        },
      });
      map.addControl(drawControl);

      map.on("draw:created", (e) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        const newGeoJSON = drawnItems.toGeoJSON();
        console.log("New GeoJSON created:", newGeoJSON);
        onGeoJSONChange(newGeoJSON);
      });

      return () => {
        map.removeControl(drawControl);
        map.off("draw:created");
      };
    }
  }, [map, onGeoJSONChange]);

  useEffect(() => {
    console.log("GeoJSON state updated:", geoJSON);

    if (map && geoJSON.features.length > 0) {
      try {
        // Clear existing layers
        map.eachLayer((layer) => {
          if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
          }
        });

        const geoJsonLayer = L.geoJSON(geoJSON);
        geoJsonLayer.addTo(map);
      } catch (e) {
        console.error("Invalid GeoJSON:", e);
      }
    }
  }, [map, geoJSON]);

  return (
    <MapContainer
      whenCreated={(mapInstance) => {
        console.log("Map created:", mapInstance);
        setMap(mapInstance);
      }}
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "665px", width: "100%" }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default MapComponent;
