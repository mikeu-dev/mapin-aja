import React, { useState } from "react";
import tokml from "tokml";
import * as topojson from 'topojson-server'; // Impor topojson-client

const Header = ({ onFileUpload, Download }) => {
  const [selectedFormat, setSelectedFormat] = useState("geojson");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formats = [
    { value: "geojson", label: "GeoJSON", extension: "geojson", mime: "application/json" },
    { value: "kml", label: "KML", extension: "kml", mime: "application/vnd.google-earth.kml+xml" },
    { value: "topojson", label: "TopoJSON", extension: "topojson", mime: "application/json" },
  ];

  const downloadFile = (format) => {
    let dataStr = "";
    let fileExtension = "";

    if (format === "geojson") {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Download));
      fileExtension = "geojson";
    } else if (format === "kml") {
      const kml = tokml(Download);
      dataStr = `${formats.find(f => f.value === "kml").mime};charset=utf-8,` + encodeURIComponent(kml);
      fileExtension = "kml";
    } else if (format === "topojson") {
      const topology = topojson.topology({ foo: Download });
      dataStr = `data:application/json;charset=utf-8,` + encodeURIComponent(JSON.stringify(topology));
      fileExtension = "topojson";
    }

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `map.${fileExtension}`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold">Mapin Aja</a>
          </div>
          <nav className="flex items-center space-x-4">
            <button>
              <label htmlFor="file-upload" className="custom-file-upload text-gray-300 hover:text-white cursor-pointer">
                Open
              </label>
              <input id="file-upload" type="file" accept=".geojson, .kml, .topojson" onChange={onFileUpload} className="hidden" />
            </button>

            <div className="relative">
              <button
                className="text-gray-300 hover:text-white cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Save
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg z-[100002]">
                  <div className="p-2">
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="w-full bg-gray-800 text-white border-none"
                    >
                      {formats.map((format) => (
                        <option key={format.value} value={format.value} className="hover:!bg-white hover:!text-gray-400">
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      downloadFile(selectedFormat);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-gray-300 hover:text-white px-4 py-2 text-left"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            <a href="/" target="_blank" className="text-gray-300 hover:text-white">
              New
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white"
              onClick={() => alert("Ups! Fitur belum tersedia.")}>
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
