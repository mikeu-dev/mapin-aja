import React, { useState } from "react";

const Popup = ({ feature, onDelete }) => {
    const [properties, setProperties] = useState(feature?.properties || {});
    const [originalProperties, setOriginalProperties] = useState(feature?.properties || {}); // Untuk membatalkan perubahan

    if (!feature || !feature.properties) {
        console.warn("Feature does not have properties:", feature);
        return <div>Data tidak tersedia</div>;
    }

    // Fungsi untuk merender tabel properti
    const renderPropertiesTable = () => {
        return (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                    {Object.entries(properties).map(([key, value]) => (
                        <tr key={key}>
                            <th
                                style={{
                                    textAlign: "left",
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {key}
                            </th>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {key.includes("Color") ? (
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        style={{ width: "100%", height: "16px" }}
                                    />
                                ) : (
                                    value
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Fungsi untuk menangani perubahan warna
    const handleColorChange = (key, color) => {
        const newProperties = { ...properties };
        newProperties[key] = color;
        setProperties(newProperties); // Update state dengan properti baru
    };

    // Fungsi untuk menambahkan properti style ke dalam tabel berdasarkan tipe layer
    const addSimpleStyleProperties = () => {
        const newProperties = { ...properties };

        // Menentukan jenis layer
        const layerType = feature.geometry.type; // Menggunakan jenis geometry dari feature

        if (layerType === "Point") {
            // Untuk Marker (Point)
            newProperties.fill = true;
            newProperties.fillColor = "#ff0000";
            newProperties.radius = 8;
            newProperties.stroke = true;
            newProperties.strokeColor = "#000000";
            newProperties.weight = 1;
            newProperties.opacity = 0.5;
        } else if (layerType === "LineString") {
            // Untuk LineString
            newProperties.stroke = true;
            newProperties.strokeColor = "#0000ff";
            newProperties.strokeWidth = 3;
            newProperties.opacity = 0.8;
        } else if (layerType === "Polygon") {
            // Untuk Polygon
            newProperties.fill = true;
            newProperties.fillColor = "#00ff00";
            newProperties.stroke = true;
            newProperties.strokeColor = "#000000";
            newProperties.weight = 2;
            newProperties.opacity = 0.6;
        } else {
            // Jika tipe layer tidak dikenali, beri peringatan
            console.warn("Unsupported layer type:", layerType);
        }

        setProperties(newProperties);  // Update state dengan properti baru
    };

    // Fungsi untuk menambahkan baris baru ke dalam tabel
    const addRow = () => {
        const newProperties = { ...properties };
        newProperties[`newProperty${Object.keys(properties).length + 1}`] = "New Value";
        setProperties(newProperties);  // Update state dengan properti baru
    };

    // Fungsi untuk menyimpan perubahan
    const saveChanges = () => {
        setOriginalProperties(properties);  // Simpan perubahan
        console.log("Changes saved:", properties);
    };

    // Fungsi untuk membatalkan perubahan
    const cancelChanges = () => {
        setProperties(originalProperties);  // Kembalikan ke state awal
        console.log("Changes canceled");
    };

    // Fungsi untuk menghapus feature
    const deleteFeature = () => {
        if (onDelete) {
            onDelete(feature);  // Memanggil fungsi onDelete yang diberikan sebagai props untuk menghapus feature
        }
        console.log("Feature deleted");
    };

    return (
        <div>
            <strong>{properties.name || "Feature"}</strong>
            {renderPropertiesTable()}
            <div className="flex justify-between">
                <button
                    onClick={addRow}
                    style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        border: "none",
                    }}
                    className="text-gray-700 hover:text-green-400 transform transition-colors duration-4"
                >
                    Add row
                </button>
                <button
                    onClick={addSimpleStyleProperties}
                    style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        border: "none",
                    }}
                    className="text-gray-700 hover:text-green-400 transform transition-colors duration-300"
                >
                    Add simplestyle properties
                </button>
            </div>
            <div style={{ marginTop: "20px" }} className="flex justify-between">
                <div className="flex items-center">
                    <button
                        onClick={saveChanges}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={cancelChanges}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "4px",
                            marginLeft: "10px",
                        }}
                        className="bg-gray-200 text-gray-700"
                    >
                        Cancel
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={deleteFeature}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            marginLeft: "10px",
                        }}
                    >
                        Delete Feature
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
