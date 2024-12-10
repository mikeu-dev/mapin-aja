"use client";
import Head from "next/head";
import { useState } from "react";
import MapComponent from "./components/MapComponent";
import Header from "./components/NavComponent";
import GeojsonEditor from "./components/GeojsonEditor";

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Fungsi untuk menangani unggahan file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          console.log("GeoJSON Data:", data);  // Cek data GeoJSON yang diterima
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
      <Header onFileUpload={handleFileUpload} />
      <main className="h-[665px] w-full">
        <div className="flex">
          <MapComponent
            geoJsonData={geoJsonData}
            onGeoJSONChange={() => { }}
          />
          <GeojsonEditor
            initialGeoJSON={geoJsonData}
            onChange={() => { }}
          />
        </div>
        {/* <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={() => { }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download GeoJSON
          </button>
        </div> */}
      </main>
    </div>
  );
}
