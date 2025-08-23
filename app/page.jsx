"use client"
import Head from "next/head";
import { useState, useEffect } from "react";
import { kml } from "@tmcw/togeojson";
import * as topojson from 'topojson-client';
import Header from "./components/NavComponent";
import GeojsonEditor from "./components/GeojsonEditor";
import { createNotification, Notification } from './components/Notification';
import MapComponent from "./components/MapComponentWrapper";

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileContent = reader.result;
          const fileName = file.name.toLowerCase();

          if (fileName.endsWith(".geojson")) {
            const data = JSON.parse(fileContent);
            setGeoJsonData(data);
            createNotification({
              type: 'success',
              message: `file ${file.name} was uploaded successfully.`,
              title: 'success',
            });
          } else if (fileName.endsWith(".kml")) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fileContent, "application/xml");

            const converted = kml(xmlDoc);
            setGeoJsonData(converted);
            createNotification({
              type: 'success',
              message: `file ${file.name} was uploaded successfully.`,
              title: 'success',
            });
          } else if (fileName.endsWith(".topojson")) {
            const topojsonData = JSON.parse(fileContent);
            const geojsonData = topojson.feature(topojsonData, topojsonData.objects[Object.keys(topojsonData.objects)[0]]);
            setGeoJsonData(geojsonData);
            createNotification({
              type: 'success',
              message: `file ${file.name} was uploaded successfully.`,
              title: 'success',
            });
          } else {
            console.error("Unsupported file format");
            createNotification({
              type: 'error',
              message: `unsupported file format ${file.name}. please upload a valid file.`,
              title: 'error',
            });
          }
        } catch (error) {
          console.error("Invalid file", error);
          createNotification({
            type: 'error',
            message: 'error parsing the file. please check the format.',
            title: 'error',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Head>
        <title>Mapin Aja</title>
        <meta name="description" content="Web for geospatial viewer." />
      </Head>
      <Header onFileUpload={handleFileUpload} Download={geoJsonData} />
      <main className="h-[665px] w-full lg:flex">
        <MapComponent
          geoJsonData={geoJsonData}
          setGeoJsonData={setGeoJsonData}
        />
        <GeojsonEditor
          initialGeoJSON={geoJsonData}
          onChange={setGeoJsonData}
        />
      </main>
      <Notification />
    </div>
  );
}
