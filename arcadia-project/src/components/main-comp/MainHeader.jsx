import React from "react";
import { FiSearch, FiUser } from 'react-icons/fi';

const MainHeader = () => (
  <header className="main-header bg-white shadow-sm">
    <div className="w-full px-2 lg:px-4 py-4 flex justify-between items-center">
      {/* Left: Logo and Title */}
      <div className="head-text-logo">
        <img src="image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
        <span className="text-3xl font-semibold text-arcadia-black">Arcadia</span>
      </div>

      {/* Center: Search Bar */}
      <div className="relative flex-grow max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search for a book or research"
          className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-arcadia-red"
        />
        <FiSearch className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Right: User Info */}
      <div className="flex items-center flex-shrink-0 mt-4 sm:mt-0">
        <span className="mr-2 hidden sm:block">Arcadia_Admin</span>
        <FiUser className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  </header>
);

export default MainHeader;
