"use client"

import { useState, useRef, useEffect } from "react"
import { FiUser } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../backend/UserContext"
import HamburgerIcon from "./HamburgerIcon"

const Header = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useUser() // Global user state from context
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // This condition was incorrect - it was using OR (||) instead of AND (&&)
    // The original condition would redirect ALL users, not just non-admin users
    if (!user || (user.userAccountType !== "Admin" && user.userAccountType !== "Superadmin")) {
      navigate("/") // Redirect to home or another page
    }
  }, [user, navigate])

  const handleLogout = () => {
    updateUser(null)
    navigate("/user/login")
  }

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center w-full">
        {/* Left-aligned Logo and Text */}
        <div className="flex items-center">
          <Link to="/admin/">
            <img src="/image/logo_admin.png" alt="Arcadia logo" className="h-8 mr-2" />
          </Link>
        </div>

        {/* Right-aligned User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative flex items-center space-x-3" ref={dropdownRef}>
              <span className="mr-2 text-arcadia-red font-medium">
                {user.userFName} {user.userLName}
              </span>
              {user.userPicture ? (
                <img
                  src={user.userPicture || "/placeholder.svg"}
                  alt={`${user.userFName}'s profile`}
                  className="h-8 w-8 border border-grey rounded-full object-cover"
                />
              ) : (
                <FiUser className="h-6 w-6 text-gray-300" />
              )}

              <div className="text-arcadia-red">
                <HamburgerIcon isOpen={isDropdownVisible} toggle={toggleDropdown} />
              </div>

              {/* Dropdown Menu */}
              <div
                className={`dropdown-menu absolute right-0 top-full mt-2 w-48 bg-white rounded-md border border-grey z-10 ${isDropdownVisible ? "visible" : ""}`}
              >
                <ul className="py-2 px-2 divide-y divide-gray">
                  <li className="hover:bg-light-gray cursor-pointer ">
                    <Link to="accountview" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Manage Account
                    </Link>
                  </li>

                  {/* Admin option to go to User Side */}
                  <li className="hover:bg-light-gray cursor-pointer">
                    <button
                      onClick={() => {
                        localStorage.setItem("mode", "user")
                        navigate("/")
                      }}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Go to User Side
                    </button>
                  </li>
                  {/* End */}

                  <li className="hover:bg-light-gray cursor-pointer">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/user/login" className="flex items-center text-black">
              <span className="mr-2">Login</span>
              <FiUser className="h-6 w-6 text-gray-300" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

