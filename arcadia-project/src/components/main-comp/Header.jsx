import React from "react";
import { FiSearch, FiUser, FiChevronRight } from 'react-icons/fi';

const Header = () => (
  <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold text-arcadia-red">Arcadia</span>
          </div>
         
          <div className="flex items-center">
            <span className="mr-2">Arcadia_Admin</span>
            <FiUser className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </header>
);

export default Header;