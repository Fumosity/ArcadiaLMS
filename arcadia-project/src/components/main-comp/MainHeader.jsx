import React from "react";
import { FiSearch, FiUser } from 'react-icons/fi';
import { FiSearch, FiUser, FiChevronRight } from 'react-icons/fi';

const MainHeader = () => (
  <header className="main-header bg-white shadow-sm">
    <div className="w-full px-2 lg:px-4 py-4 flex justify-between items-center">
      {/* Left: Logo and Title */}
      <div className="title-logo">
        <img src="image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-semibold text-arcadia-red">Arcadia</span>
      </div>
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
            <img src="image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold text-arcadia-red">Arcadia</span>
          </div>
         
          <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a book or research"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-arcadia-red"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
          <div className="flex items-center">
            <span className="mr-2">Arcadia_Admin</span>
            <FiUser className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </header>
);

export default MainHeader;
