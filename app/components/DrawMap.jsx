import { useState } from "react";
import L from "leaflet";
import { FeatureGroup, Marker, Popup, Polygon, Circle, Polyline, Rectangle, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const DrawComponent = () => {
    const [drawnItems, setDrawnItems] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [polygonCoordinates, setPolygonCoordinates] = useState(null);
    const [circleData, setCircleData] = useState(null);
    const [polylineCoordinates, setPolylineCoordinates] = useState(null);
    const [rectangleBounds, setRectangleBounds] = useState(null);
    const map = useMap();

    // // Event untuk menggambar elemen baru di peta
    // map.on(L.Draw.Event.CREATED, (e) => {
    //     console.debug("Event CREATED triggered:", e);
    //     const { layerType, layer } = e;

    //     const id = Date.now(); // ID unik untuk setiap fitur yang dibuat

    //     // Simpan posisi/koordinat tergantung jenis layer
    //     if (layerType === "marker") {
    //         const position = layer.getLatLng();
    //         setMarkerPosition(position); // Simpan posisi marker
    //     } else if (layerType === "polygon") {
    //         const coordinates = layer.getLatLngs();
    //         setPolygonCoordinates(coordinates); // Simpan koordinat polygon
    //     } else if (layerType === "circle") {
    //         const center = layer.getLatLng();
    //         const radius = layer.getRadius();
    //         setCircleData({ center, radius }); // Simpan data circle
    //     } else if (layerType === "polyline") {
    //         const coordinates = layer.getLatLngs();
    //         setPolylineCoordinates(coordinates); // Simpan koordinat polyline
    //     } else if (layerType === "rectangle") {
    //         const bounds = layer.getBounds();
    //         setRectangleBounds(bounds); // Simpan bounds rectangle
    //     }

    //     // Menambahkan ID ke setiap feature
    //     layer.feature = {
    //         ...layer.feature,
    //         id: id, // Menambahkan ID pada feature yang dibuat
    //     };
    //     // Tambahkan layer baru ke peta dan state jika belum ada
    //     if (!drawnItems.some(item => item._leaflet_id === layer._leaflet_id)) {
    //         const newDrawnItems = [...drawnItems, layer];
    //         setDrawnItems(newDrawnItems);
    //         map.addLayer(layer);
    //     } else {
    //         console.debug("Layer already exists, skipping add.");
    //     }
    // });

    // map.on(L.Draw.Event.EDITED, (e) => {
    //     console.debug("Event EDITED triggered:", e);
    //     const layers = e.layers;

    //     // Update drawnItems berdasarkan layer yang diedit
    //     const updatedItems = drawnItems.map((item) => {
    //         const editedLayer = layers.getLayer(item._leaflet_id);
    //         if (editedLayer) {
    //             // Hanya ganti layer yang benar-benar diedit
    //             return editedLayer;
    //         }
    //         return item;  // Kembalikan item lama jika tidak diedit
    //     });

    //     // Perbarui state dengan items yang telah diedit
    //     setDrawnItems(updatedItems);

    //     // Hapus layer yang lama (sebelumnya sudah ada) dan tambahkan layer yang baru
    //     layers.eachLayer((layer) => {
    //         map.removeLayer(layer);
    //         map.addLayer(layer);  // Hanya menambahkan layer yang sudah diperbarui
    //     });
    // });

    // map.on(L.Draw.Event.DELETED, (e) => {
    //     console.debug("Event DELETED triggered:", e);
    //     const layers = e.layers;

    //     // Hapus layer yang sudah dihapus dari drawnItems
    //     const remainingItems = drawnItems.filter(
    //         (item) => !layers.getLayers().some((layer) => layer._leaflet_id === item._leaflet_id)
    //     );

    //     // Hapus layer yang dihapus dari peta
    //     layers.eachLayer((layer) => {
    //         map.removeLayer(layer);
    //         console.debug("Removed layer from map:", layer);
    //     });

    //     setDrawnItems(remainingItems);  // Perbarui state dengan item yang tersisa
    // });

    // Komponen untuk menampilkan marker dari hasil gambar
    const LocationMarker = () => {
        return markerPosition ? (
            <Marker position={markerPosition}>
                <Popup>Marker yang Anda gambar</Popup>
            </Marker>
        ) : null;
    };

    // Komponen untuk menampilkan polygon dari hasil gambar
    const PolygonDisplay = () => {
        return polygonCoordinates ? (
            <Polygon positions={polygonCoordinates}>
                <Popup>Polygon yang Anda gambar</Popup>
            </Polygon>
        ) : null;
    };

    // Komponen untuk menampilkan circle dari hasil gambar
    const CircleDisplay = () => {
        return circleData ? (
            <Circle center={circleData.center} radius={circleData.radius}>
                <Popup>Circle yang Anda gambar</Popup>
            </Circle>
        ) : null;
    };

    // Komponen untuk menampilkan polyline dari hasil gambar
    const PolylineDisplay = () => {
        return polylineCoordinates ? (
            <Polyline positions={polylineCoordinates}>
                <Popup>Polyline yang Anda gambar</Popup>
            </Polyline>
        ) : null;
    };

    // Komponen untuk menampilkan rectangle dari hasil gambar
    const RectangleDisplay = () => {
        return rectangleBounds ? (
            <Rectangle bounds={rectangleBounds}>
                <Popup>Rectangle yang Anda gambar</Popup>
            </Rectangle>
        ) : null;
    };

    return (
        <FeatureGroup>
            <EditControl
                position="topright"
                draw={{
                    circlemarker: false,
                }}
            />
            <LocationMarker />
            <PolygonDisplay />
            <CircleDisplay />
            <PolylineDisplay />
            <RectangleDisplay />
        </FeatureGroup>
    );
};

export default DrawComponent;
