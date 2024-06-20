"use client";
import Head from "next/head";
import { useState } from "react";
import MapComponent from "./components/MapComponent";
import Header from "./components/NavComponent";
import GeojsonEditor from "./components/GeojsonEditor";

export default function Home() {
  const initialGeoJSON = {
    type: "FeatureCollection",
    features: [],
  };

  const [geoJSON, setGeoJSON] = useState(initialGeoJSON);

  const handleGeoJSONChange = (newGeoJSON) => {
    setGeoJSON(newGeoJSON);
  };

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
    <div>
      <Head>
        <title>Mapin Aja</title>
      </Head>
      <Header />
      <main className="h-[665px] w-full">
        <div className="flex">
          <MapComponent
            geoJSON={geoJSON}
            onGeoJSONChange={handleGeoJSONChange}
          />
          <GeojsonEditor
            initialGeoJSON={geoJSON}
            onChange={handleGeoJSONChange}
          />
        </div>
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={downloadGeoJson}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download GeoJSON
          </button>
        </div>
      </main>
    </div>
  );
}
