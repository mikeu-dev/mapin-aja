import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-solarized_light";

const GeojsonEditor = ({ initialGeoJSON, onChange }) => {
  const handleChange = (newValue) => {
    try {
      const parsed = JSON.parse(newValue);
      onChange(parsed); // langsung update parent
    } catch {
      // biarkan, JSON tidak valid -> jangan update parent
    }
  };

  return (
    <div
      style={{
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
        value={
          initialGeoJSON
            ? JSON.stringify(initialGeoJSON, null, 2)
            : ""
        }
        onChange={handleChange}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          useWorker: true,
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
