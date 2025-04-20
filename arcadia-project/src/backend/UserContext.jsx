import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Add storage event listener to detect changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only react to changes in the "user" item
      if (event.key === "user") {
        // If user was removed (logout in another tab)
        if (event.newValue === null) {
          setUser(null)
          navigate("/user/login")
        } else if (event.newValue) {
          // If user was updated in another tab
          setUser(JSON.parse(event.newValue))
        }
      }
    }

    // Add event listener
    window.addEventListener("storage", handleStorageChange)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [navigate])

  useEffect(() => {
    const mode = localStorage.getItem("mode")
    if (user && !loading && mode !== "user") {
      if (!isValidRoute(location.pathname, user.userAccountType)) {
        navigateBasedOnRole(user.userAccountType)
      }
    }
  }, [user, loading, location.pathname])

  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      navigateBasedOnRole(newUser.userAccountType) // Navigate immediately
    } else {
      localStorage.removeItem("user")
      setUser(null)
      navigate("/user/login")
    }
  }

  const loginAsGuest = () => {
    const guestUser = {
      userID: "0", // Add timestamp for uniqueness
      name: "Guest",
      userAccountType: "Guest",
      isGuest: true, // Flag to identify guest users
      loginTime: new Date().toISOString(), // Track when the guest logged in
    }

    // Store guest user in localStorage
    localStorage.setItem("user", JSON.stringify(guestUser))
    setUser(guestUser)

    // Navigate to home page
    navigate("/")
  }

  const navigateBasedOnRole = (userAccountType) => {
    if (!userAccountType) {
      navigate("/user/login")
      return
    }

    const userRoutes = ["/", "/bookmanagement", "/catalog", "/research"]

    if (["Admin", "Superadmin", "Intern"].includes(userAccountType)) {
      navigate("/admin")
    } else if (["Student", "Faculty", "Guest"].includes(userAccountType)) {
      navigate(userRoutes.includes(location.pathname) ? location.pathname : "/")
    } else {
      navigate("/user/login")
    }
  }

  const isValidRoute = (path, userType) => {
    const adminRoutes = ["/admin", "/admin/bookmanagement", "/admin/analytics"]
    const userRoutes = ["/", "/bookmanagement", "/catalog", "/research"]
    const restrictedRoutes = ["/user/reservations", "/user/services", "/user/support"]

    // Guest users cannot access restricted routes
    if (userType === "Guest" && restrictedRoutes.some((route) => path.startsWith(route))) {
      return false
    }

    if (["Admin", "Superadmin", "Intern"].includes(userType)) {
      return adminRoutes.some((route) => path.startsWith(route))
    }
    if (["Student", "Teacher", "Guest"].includes(userType)) {
      return userRoutes.some((route) => path.startsWith(route))
    }
    return false
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return <UserContext.Provider value={{ user, updateUser, loginAsGuest }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)