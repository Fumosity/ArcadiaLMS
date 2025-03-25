import { useState, useRef, useEffect } from "react"
import { FiUser } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../../backend/UserContext"
import HamburgerIcon from "../../main-comp/HamburgerIcon"

const UHeader = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useUser() // Global user state from context
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)

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
    <header className="bg-arcadia-red shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center w-full">
        {/* Left-aligned Logo and Text */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/image/logo_user.png" alt="Arcadia logo" className="h-8 mr-2" />
          </Link>
        </div>

        {/* Right-aligned User Info */}
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="relative flex items-center space-x-2" ref={dropdownRef}>
              <div className="flex relative items-center space-x-2">
                {user.userAccountType === "Guest" ? (
                  <span className=" text-white">Guest Mode</span>
                ) : (
                  <span className=" text-white">
                    {user.userFName} {user.userLName}
                  </span>
                )}

                {user.userPicture ? (
                  <img
                    src={user.userPicture || "/placeholder.svg"}
                    alt={`${user.userFName}'s profile`}
                    className="h-8 w-8 rounded-full object-cover border border-grey"
                  />
                ) : (
                  <FiUser className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="text-white">
                <HamburgerIcon isOpen={isDropdownVisible} toggle={toggleDropdown} />
              </div>


              {/* Dropdown Menu */}
              <div
                className={`dropdown-menu absolute right-0 top-full mt-2 w-48 bg-white rounded-md border border-grey z-10 ${isDropdownVisible ? "visible" : ""}`}
              >
                {user.userAccountType === "Guest" ? (
                  <ul className="py-2 px-2 divide-y divide-grey">
                    <li className="hover:bg-grey cursor-pointer">
                      <Link to="/user/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Login
                      </Link>
                    </li>
                    <li className="hover:bg-grey cursor-pointer">
                      <Link to="/user/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="py-2 px-2 divide-y divide-grey">
                    <li className="hover:bg-grey cursor-pointer">
                      <Link to="/user/accountview" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Manage Account
                      </Link>
                    </li>

                    {/* Show "Back to Admin side" only if user is an Admin or Superadmin */}
                    {(user.userAccountType === "Admin" || user.userAccountType === "Superadmin") && (
                      <li className="hover:bg-grey cursor-pointer">
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Back to Admin side
                        </Link>
                      </li>
                    )}

                    <li className="hover:bg-grey cursor-pointer">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
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
  )
}

export default UHeader

