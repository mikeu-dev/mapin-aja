// components/DownloadGeoJSON.jsx
"use client"
import React, { useState } from "react";

const DownloadGeoJSON = ({ geoJSON }) => {
  const downloadGeoJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(geoJSON));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.geojson");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <button
      onClick={downloadGeoJson}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Download GeoJSON
    </button>
  );
};

export default DownloadGeoJSON;
