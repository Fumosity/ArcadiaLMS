import React from "react";
import { FiUser } from 'react-icons/fi';

const Header = () => (
  <header className="bg-arcadia-red shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      
      {/* Left-aligned Logo and Text */}
      <div className="flex items-center">
        <img src="image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-semibold text-white">Arcadia</span>
      </div>
      
      {/* Right-aligned Admin Info */}
      <div className="ml-auto flex items-center">
        <span className="mr-2 text-white">Arcadia_Admin</span>
        <FiUser className="h-6 w-6 text-gray-300" />
      </div>
    </div>
  </header>
);

export default Header;
