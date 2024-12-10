import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
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

  const FitBoundsComponent = () => {
    const mapInstance = useMap();

    useEffect(() => {
      if (mapInstance && geoJsonData) {
        console.log("GeoJSON Data:", geoJsonData);

        // Hapus layer lama jika ada
        if (geoJsonLayer) {
          mapInstance.removeLayer(geoJsonLayer);
        }

        // Menambahkan layer GeoJSON baru
        if (geoJsonData.features.length > 0) {
          const newGeoJsonLayer = L.geoJSON(geoJsonData).addTo(mapInstance);
          setGeoJsonLayer(newGeoJsonLayer);
          const newBounds = newGeoJsonLayer.getBounds();
          mapInstance.fitBounds(newBounds, { animate: true });
        }
      }
    }, [mapInstance]); // Menggunakan geoJsonData tanpa geoJsonLayer

    return null;
  };

  function LeafletControlGeocoder() {
    const map = useMap();

    useEffect(() => {
      if (map) {
        // Pastikan hanya satu kontrol pencarian yang ditambahkan
        map.zoomControl.setPosition("topright");
        const geocoder = L.Control.Geocoder.nominatim();

        // Periksa apakah kontrol pencarian sudah ada di peta
        if (!map._controlContainer.querySelector(".leaflet-control-geocoder")) {
          L.Control.geocoder({
            query: "",
            placeholder: "Search here...",
            defaultMarkGeocode: false,
            geocoder,
          })
            .on("markgeocode", function (e) {
              const latlng = e.geocode.center;
              L.marker(latlng).addTo(map)
                .bindPopup(e.geocode.name)
                .openPopup();
              map.flyToBounds(e.geocode.bbox, map.getZoom());
            })
            .addTo(map);
        }
      }
    }, [map]);

    return null;
  }

  useEffect(() => {
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


  const DrawComponent = ({ onEditPath, onCreate, onDeleted }) => (
    <FeatureGroup>
      <EditControl
        position='topright'
        onEdited={onEditPath}
        onCreated={onCreate}
        onDeleted={onDeleted}
        draw={{
          marker: true,
          polygon: true,
          polyline: true,
          rectangle: true,
          circle: true,
        }}
      />
    </FeatureGroup>
  );

  // Fungsi untuk menangani event onEdited, onCreated, dan onDeleted
  const onEditPath = (e) => {
    console.log("Edited path:", e);
  };

  const onCreate = (e) => {
    console.log("Created:", e);
  };

  const onDeleted = (e) => {
    console.log("Deleted:", e);
  };

  return (
    <MapContainer
      whenCreated={(mapInstance) => {
        setMap(mapInstance);
      }}
      center={[-0.7893, 113.9213]}
      zoom={5}
      style={{ height: "665px", width: "100%" }}
      doubleClickZoom={false}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {geoJsonData && <GeoJSON data={geoJsonData} />}
      <FitBoundsComponent />
      <LeafletControlGeocoder />
      <DrawComponent
        onEditPath={onEditPath}
        onCreate={onCreate}
        onDeleted={onDeleted}
      />
    </MapContainer>
  );
};

export default MapComponent;
