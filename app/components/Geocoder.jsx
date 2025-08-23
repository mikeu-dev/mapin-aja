// src/components/LeafletControlGeocoder.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const LeafletControlGeocoder = ({ onSelect }) => {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (map) {
      map.zoomControl.setPosition("topright");

      if (!map._controlContainer.querySelector(".leaflet-control-geocoder")) {
        const geoCoderControl = L.Control.geocoder({
          collapsed: false,
          geocoder: L.Control.Geocoder.nominatim(),
          position: "topright",
          placeholder: "Search...",
          defaultMarkGeocode: false,
        });
        geoCoderControl.addTo(map);

        const container = geoCoderControl.getContainer();
        const input = container.querySelector("input");

        input.setAttribute("type", "text");
        input.style.caretColor = "black"; 
        input.style.cursor = "text";

        const resultsContainer = document.createElement("div");
        resultsContainer.classList.add(
          "leaflet-control-geocoder-results",
          "relative",
          "bg-white",
          "border",
          "border-gray-300",
          "rounded-md",
          "shadow-lg",
          "max-h-60",
          "overflow-auto",
          "z-10",
          "w-80",
          "max-w-80",
          "text-gray-500"
        );
        container.appendChild(resultsContainer);

        const clearBtn = document.createElement("button");
        clearBtn.innerHTML = "✕";
        clearBtn.type = "button";
        clearBtn.className =
          "absolute right-2 top-2 text-gray-400 hover:text-gray-600";
        clearBtn.style.display = "none"; 
        clearBtn.addEventListener("click", () => {
          input.value = "";
          resultsContainer.innerHTML = "";
          clearBtn.style.display = "none";

          if (markerRef.current) {
            map.removeLayer(markerRef.current);
            markerRef.current = null;
          }

          // reset geojson ke parent
          if (onSelect) {
            onSelect(null);
          }
        });
        container.style.position = "relative";
        container.appendChild(clearBtn);

        input.addEventListener("input", (e) => {
          const query = e.target.value;
          clearBtn.style.display = query ? "block" : "none";

          if (query) {
            const geocoder = L.Control.Geocoder.nominatim();

            geocoder.geocode(query, (results) => {
              resultsContainer.innerHTML = "";

              if (results.length > 0) {
                results.forEach((result) => {
                  const item = document.createElement("div");
                  item.className =
                    "leaflet-control-geocoder-result relative cursor-pointer p-2 hover:bg-gray-100 max-w-80 text-gray-500";
                  item.innerHTML = result.name;
                  item.addEventListener("click", () => {
                    map.flyTo(result.center, map.getZoom());

                    if (markerRef.current) {
                      map.removeLayer(markerRef.current);
                    }

                    const newMarker = L.marker(result.center).addTo(map);
                    markerRef.current = newMarker;

                    newMarker.bindPopup(result.name).openPopup();

                    // === kirim data ke parent dalam format GeoJSON Point ===
                    const geojsonPoint = {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [result.center.lng, result.center.lat],
                      },
                      properties: {
                        name: result.name,
                      },
                    };

                    if (onSelect) {
                      onSelect(geojsonPoint);
                    }
                  });
                  resultsContainer.appendChild(item);
                });
              } else {
                resultsContainer.innerHTML =
                  '<div class="p-2 text-center text-gray-500">Tidak ada hasil ditemukan</div>';
              }
            });
          } else {
            resultsContainer.innerHTML = "";
          }
        });
      }
    }
  }, [map, onSelect]);

  return null;
};

export default LeafletControlGeocoder;
