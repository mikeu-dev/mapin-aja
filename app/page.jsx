"use client"
import Head from "next/head";
import { useState, useEffect } from "react";
import { kml } from "@tmcw/togeojson";
import * as topojson from 'topojson-client';
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
          const fileContent = reader.result;
          const fileName = file.name.toLowerCase();

          // Validasi berdasarkan ekstensi
          if (fileName.endsWith(".geojson")) {
            const data = JSON.parse(fileContent);
            setGeoJsonData(data);
          } else if (fileName.endsWith(".kml")) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fileContent, "application/xml");

            const parseError = xmlDoc.getElementsByTagName("parsererror");
            if (parseError.length > 0) {
              console.error("Error parsing XML:", parseError[0].textContent);
              alert("Invalid KML structure.");
              return;
            }

            const converted = kml(xmlDoc);
            setGeoJsonData(converted);
          } else if (fileName.endsWith(".topojson")) {
            const topojsonData = JSON.parse(fileContent);
            const geojsonData = topojson.feature(topojsonData, topojsonData.objects[Object.keys(topojsonData.objects)[0]]);
            setGeoJsonData(geojsonData);
          } else {
            console.error("Unsupported file format");
            alert("Unsupported file format. Please upload a GeoJSON, KML, or TopoJSON file.");
          }
        } catch (error) {
          console.error("Invalid file", error);
          alert("Error parsing the file. Please check the format.");
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
