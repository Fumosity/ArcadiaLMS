import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

const UHeader = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser(); // Global user state from context
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let dropdownTimeout;

  const handleLogout = () => {
    updateUser(null);
    navigate("/user/login");
  };

  const showDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    dropdownTimeout = setTimeout(() => setIsDropdownVisible(false), 500);
  };

  

  return (
    <header className="bg-arcadia-red shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center w-full">
        {/* Left-aligned Logo and Text */}
        <div className="flex items-center">
          <img src="/image/arcadia.png" alt="Arcadia logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold text-white">Arcadia</span>
        </div>

        {/* Right-aligned User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div
              className="relative group flex items-center space-x-3"
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <span className="mr-2 text-white cursor-pointer">
                {user.userFName} {user.userLName}
              </span>
              {user.userPicture ? (
                <img
                  src={user.userPicture}
                  alt={`${user.userFName}'s profile`}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <FiUser className="h-6 w-6 text-gray-300" />
              )}

              {/* Dropdown Menu */}
              {isDropdownVisible && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/user/accountview"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Manage Account
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
            <Link to="/user/login" className="flex items-center text-white">
              <span className="mr-2">Login</span>
              <FiUser className="h-6 w-6 text-gray-300" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default UHeader;
