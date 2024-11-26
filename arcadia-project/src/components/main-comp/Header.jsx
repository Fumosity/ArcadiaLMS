import React, { useState } from "react";
import { FiUser } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate(); //Command to navigate to a desired page
  const admin = JSON.parse(localStorage.getItem("user")); //Get currently logged-on admin
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let dropdownTimeout;

  //Logout Function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const showDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    dropdownTimeout = setTimeout(() => setIsDropdownVisible(false), 500); // 500ms delay before hiding
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left-aligned Logo and Text */}
        <div className="flex items-center">
          <img src="/image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold text-arcadia-red">Arcadia Admin</span>
        </div>

        {/* Right-aligned Admin Info */}
        <div className="ml-auto flex items-center relative">
          {admin ? (
            <div
              className="relative group"
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <span className="mr-2 cursor-pointer text-arcadia-red font-medium">
                {admin.userFName} {admin.userLName}
              </span>
              <FiUser className="h-6 w-6 text-gray-500" />

              {/* Dropdown Menu */}
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/admin/login" className="mr-2 text-arcadia-red font-medium">
                Login
              </Link>
              <FiUser className="h-6 w-6 text-gray-500" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
