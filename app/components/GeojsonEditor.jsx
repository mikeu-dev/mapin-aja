import AceEditor from "react-ace";
import { useEffect, useState } from "react";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";

const GeojsonEditor = ({ initialGeoJSON, onChange }) => {
  const [geoJSON, setGeoJSON] = useState("");

  useEffect(() => {
    if (initialGeoJSON) {
      setGeoJSON(JSON.stringify(initialGeoJSON, null, 2));
    } else {
      setGeoJSON("");
    }
  }, [initialGeoJSON]);

  const handleChange = (newValue) => {
    setGeoJSON(newValue);
    try {
      const parsed = JSON.parse(newValue);
      onChange(parsed); // Callback saat JSON valid
    } catch (e) {
      // Abaikan jika JSON tidak valid
    }
  };

  return (
    <div style={{
      width: "100%",
      margin: "auto",
      overflow: "hidden",
    }}
    className="lg:max-w-[350px]"
    >
      <AceEditor
        mode="json"
        theme="solarized_light"
        name="geojson-editor"
        value={geoJSON}
        onChange={handleChange}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          useWorker: true, // Mengaktifkan validasi JSON otomatis
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          width: "100%",
          height: "92vh",
          borderRadius: "3px",
        }}
      />
    </div>
  );
};

export default GeojsonEditor;
