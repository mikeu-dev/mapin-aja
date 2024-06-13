"use client"
import Head from 'next/head';
import { useState } from 'react';
import MapComponent from './components/MapComponent';
import Header from './components/NavComponent';

export default function Home() {
    const [geojson, setGeojson] = useState(null);

    const handleGeoJsonChange = (geojsonData) => {
        setGeojson(geojsonData);
    };

    const downloadGeoJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "data.geojson");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div>
            <Head>
                <title>GeoJSON Clone</title>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw/dist/leaflet.draw.css" />
            </Head>
            <Header/>
            <main className="h-{665px}">
                <MapComponent onGeoJsonChange={handleGeoJsonChange} />
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    {geojson && (
                        <button onClick={downloadGeoJson} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Download GeoJSON
                        </button>
                    )}
                </div>
                {geojson && (
                    <pre className="absolute bottom-0 left-0 mt-4 ml-4 p-2 border rounded bg-gray-100">
                        {JSON.stringify(geojson, null, 2)}
                    </pre>
                )}
            </main>
        </div>
    );
}
