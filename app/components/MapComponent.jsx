import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet-draw";

const MapComponent = ({ geoJsonData, onGeoJSONChange }) => {
  const [map, setMap] = useState(null);

  // Komponen untuk menangani fitBounds dengan animasi
  const FitBoundsComponent = () => {
    const mapInstance = useMap(); // Mengakses peta melalui hook useMap

    useEffect(() => {
      if (mapInstance && geoJsonData) {
        console.log("GeoJSON Data:", geoJsonData);

        // Hapus layer lama sebelum menambahkan layer baru
        mapInstance.eachLayer((layer) => {
          if (layer instanceof L.GeoJSON) {
            mapInstance.removeLayer(layer);
          }
        });

        // Tambahkan GeoJSON ke peta
        const geoJsonLayer = L.geoJSON(geoJsonData).addTo(mapInstance);

        // Dapatkan bounds dari layer GeoJSON yang baru
        const newBounds = geoJsonLayer.getBounds();

        // Terapkan fitBounds dengan animasi
        mapInstance.fitBounds(newBounds, {
          animate: true, // Mengaktifkan animasi
          duration: 1,   // Durasi animasi dalam detik (lebih besar = lebih lambat)
          easeLinearity: 0.25, // Menyesuaikan kelancaran animasi (0 = linear, 1 = cepat lalu lambat)
        });
      }
    }, [mapInstance]); // Tidak perlu geoJsonData dalam dependensi karena geoJsonData sudah digunakan dalam kondisi if

    return null;
  };

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

  return (
    <MapContainer
      whenCreated={(mapInstance) => {
        setMap(mapInstance);
      }}
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "665px", width: "100%" }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Menampilkan GeoJSON jika ada */}
      {geoJsonData && <GeoJSON data={geoJsonData} />}
      {/* Komponen FitBoundsComponent untuk melakukan fitBounds dengan animasi */}
      <FitBoundsComponent />
    </MapContainer>
  );
};

export default MapComponent;
