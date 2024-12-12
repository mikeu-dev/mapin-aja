// src/components/LeafletControlGeocoder.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const LeafletControlGeocoder = () => {
    const map = useMap();
    const markerRef = useRef(null);  // Menggunakan useRef untuk menyimpan marker

    useEffect(() => {
        if (map) {
            map.zoomControl.setPosition("topright");

            // Membuat kontrol geocoder dengan Nominatim
            if (!map._controlContainer.querySelector(".leaflet-control-geocoder")) {
                const geoCoderControl = L.Control.geocoder({
                    collapsed: false,
                    geocoder: L.Control.Geocoder.nominatim(),
                    position: "topright", // posisi kontrol
                    placeholder: "Cari lokasi..." // placeholder input
                });
                geoCoderControl.addTo(map);

                // Mendapatkan input field geocoder
                const input = geoCoderControl.getContainer().querySelector("input");

                // Membuat elemen untuk menampilkan hasil pencarian
                const resultsContainer = document.createElement("div");
                resultsContainer.classList.add("leaflet-control-geocoder-results", "relative", "bg-white", "border", "border-gray-300", "rounded-md", "shadow-lg", "max-h-60", "overflow-auto", "z-10", "w-80", "max-w-80");
                geoCoderControl.getContainer().appendChild(resultsContainer);

                // Event listener untuk menangani pencarian saat input berubah
                input.addEventListener("input", (e) => {
                    const query = e.target.value;

                    if (query) {
                        // Lakukan pencarian geocoder langsung
                        const geocoder = L.Control.Geocoder.nominatim();

                        geocoder.geocode(query, (results) => {
                            resultsContainer.innerHTML = ''; // Kosongkan hasil sebelumnya

                            if (results.length > 0) {
                                // Tampilkan hasil pencarian
                                results.forEach((result) => {
                                    const item = document.createElement('div');
                                    item.className = 'leaflet-control-geocoder-result relative cursor-pointer p-2 hover:bg-gray-100 max-w-80';
                                    item.innerHTML = result.name;
                                    item.addEventListener('click', () => {
                                        // Menangani klik hasil pencarian
                                        map.flyTo(result.center, map.getZoom());

                                        // Jika sudah ada marker sebelumnya, hapus
                                        if (markerRef.current) {
                                            map.removeLayer(markerRef.current);
                                        }

                                        // Tambahkan marker di lokasi hasil pencarian
                                        const newMarker = L.marker(result.center).addTo(map);
                                        markerRef.current = newMarker;  // Simpan referensi marker baru

                                        // Anda bisa menambahkan popup jika diperlukan
                                        newMarker.bindPopup(result.name).openPopup();
                                    });
                                    resultsContainer.appendChild(item);
                                });
                            } else {
                                // Jika tidak ada hasil, tampilkan pesan "Tidak ada hasil"
                                resultsContainer.innerHTML = '<div class="p-2 text-center text-gray-500">Tidak ada hasil ditemukan</div>';
                            }
                        });
                    } else {
                        // Jika tidak ada input, sembunyikan hasil
                        resultsContainer.innerHTML = '';
                    }
                });
            }
        } 
    }, [map]);  // Pastikan efek hanya berjalan sekali pada mount

    return null;
};

export default LeafletControlGeocoder;
