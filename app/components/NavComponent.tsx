import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">geojson.io</h1>
          </div>
          <nav className="space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">
              File
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Edit
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              View
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
