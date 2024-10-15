import React from "react";
import { FiSearch, FiUser } from 'react-icons/fi';

const MainHeader = () => (
  <header className="main-header bg-white shadow-sm">
    <div className="w-full px-2 lg:px-4 py-4 flex justify-between items-center">

      {/* Center: Search Bar */}
      <div className="relative flex-grow max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search for a book or research"
          className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-arcadia-red"
        />
        <FiSearch className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  </header>
);

export default MainHeader;
