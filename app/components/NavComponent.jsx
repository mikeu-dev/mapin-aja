import React from "react";

const Header = ({ onFileUpload, Download }) => {
  const downloadGeoJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(Download));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.geojson");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold">Mapin Aja</a>
          </div>
          <nav className="flex items-center space-x-4">
            <button>
              <label htmlFor="file-upload" className="custom-file-upload text-gray-300 hover:text-white cursor-pointer">
                Open
              </label>
              <input id="file-upload" type="file" accept=".geojson" onChange={onFileUpload} className="hidden" />
            </button>
            <a className="text-gray-300 hover:text-white cursor-pointer" onClick={downloadGeoJson}>
              Save
            </a>
            <a href="/" target="_blank" className="text-gray-300 hover:text-white">
              New
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white"
              onClick={() => alert("Ups! Fitur belum tersedia.")}>
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
