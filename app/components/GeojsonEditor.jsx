import { useEffect, useRef, useState } from "react";

const GeojsonEditor = ({ initialGeoJSON, onChange }) => {
  const [geoJSON, setGeoJSON] = useState("");

  const [lineNumbers, setLineNumbers] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialGeoJSON) {
      setGeoJSON(JSON.stringify(initialGeoJSON, null, 2));
    } else {
      setGeoJSON("");
    }
  }, [initialGeoJSON]);

  useEffect(() => {
    const updateLineNumbers = () => {
      const lines = geoJSON.split("\n");
      setLineNumbers(Array.from(Array(lines.length), (_, index) => index + 1));
    };

    updateLineNumbers();

    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [geoJSON]);

  const handleChange = (event) => {
    const { value } = event.target;
    setGeoJSON(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
    } catch (e) {
      // Do nothing if JSON is invalid
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "350px",
        margin: "auto",
        height: "665px",
        maxHeight: "665px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: "0 0 auto",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            fontFamily: "monospace",
          }}
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              style={{ marginRight: "5px", textAlign: "right", color: "#999" }}
            >
              {num}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={geoJSON}
          onChange={handleChange}
          rows={10}
          style={{
            flex: "1",
            width: "100%",
            height: "665px",
            maxHeight: "665px",
            fontFamily: "monospace",
            padding: "10px",
            fontSize: "12px",
            lineHeight: "1.5",
            resize: "vertical",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
  );
};

export default GeojsonEditor;
