import React from "react";

const Header = ({ onFileUpload }) => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Mapin Aja</h1>
          </div>
          <nav className="space-x-4">
            <input type="file" accept=".geojson" onChange={onFileUpload} />

            <a href="#" className="text-gray-300 hover:text-white">
              Save
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              New
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
