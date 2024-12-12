"use client"
import Head from "next/head";
import { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import Header from "./components/NavComponent";
import GeojsonEditor from "./components/GeojsonEditor";

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const handleGeoJSONChange = (updatedGeoJSON) => {
    setGeoJsonData(updatedGeoJSON);
  };

  useEffect(() => {
    if (geoJsonData) {
      console.log("Updated GeoJSON data:", geoJsonData);
    }
  }, [geoJsonData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          setGeoJsonData(data);  // Menyimpan data GeoJSON
        } catch (error) {
          console.error('Invalid GeoJSON file', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Head>
        <title>Mapin Aja</title>
      </Head>
      <Header onFileUpload={handleFileUpload} Download={geoJsonData} />
      <main className="h-[665px] w-full flex">
        <MapComponent
          geoJsonData={geoJsonData}
          onGeoJSONChange={handleGeoJSONChange}
        />
        <GeojsonEditor
          initialGeoJSON={geoJsonData}
          onChange={handleGeoJSONChange}
        />
      </main>
    </div>
  );
}
