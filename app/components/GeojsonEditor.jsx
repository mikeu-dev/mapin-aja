import AceEditor from "react-ace";
import { useEffect, useState } from "react";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const GeojsonEditor = ({ initialGeoJSON, onChange }) => {
  const [geoJSON, setGeoJSON] = useState("");
  const [errors, setErrors] = useState([]);

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
      setErrors([]); // Reset errors jika JSON valid
      onChange(parsed); // Callback saat JSON valid
    } catch (e) {
      const lineNumber = e.location ? e.location.line : null;
      setErrors([{ message: e.message, line: lineNumber }]); // Menyimpan informasi kesalahan
    }
  };

  const annotations = errors.map(error => ({
    row: error.line - 1, // AceEditor mengindeks baris mulai dari 0
    column: 0,
    text: error.message,
    type: "error", // Jenis anotasi adalah error
  }));

  return (
    <div style={{
      width: "100%",
      maxWidth: "350px",
      margin: "auto",
      overflow: "hidden",
    }}>
      <AceEditor
        mode="json"
        theme=""
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
        annotations={annotations} // Menambahkan anotasi kesalahan
        style={{
          width: "100%",
          height: "91vh",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default GeojsonEditor;
