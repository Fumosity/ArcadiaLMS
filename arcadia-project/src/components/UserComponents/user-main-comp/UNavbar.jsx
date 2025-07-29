import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Sync changes across browser tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user") {
        if (event.newValue === null) {
          setUser(null)
          navigate("/user/login")
        } else {
          setUser(JSON.parse(event.newValue))
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [navigate])

  // Navigate based on user role after loading
  useEffect(() => {
    if (loading) return // Wait until user is loaded

    const mode = localStorage.getItem("mode") || "user"

    if (!user) {
      navigate("/user/login")
      return
    }

    if (mode !== "user" && !isValidRoute(location.pathname, user.userAccountType)) {
      navigateBasedOnRole(user.userAccountType)
    }
  }, [user, loading, location.pathname])

  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      navigateBasedOnRole(newUser.userAccountType)
    } else {
      localStorage.removeItem("user")
      setUser(null)
      navigate("/user/login")
    }
  }

  const loginAsGuest = () => {
    const guestUser = {
      userID: "0",
      name: "Guest",
      userAccountType: "Guest",
      isGuest: true,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("user", JSON.stringify(guestUser))
    setUser(guestUser)
    navigate("/")
  }

  const navigateBasedOnRole = (userAccountType) => {
    if (!userAccountType) {
      navigate("/user/login")
      return
    }

    const userRoutes = [
      "/",
      "/user/bookmanagement",
      "/user/researchmanagement",
      "/user/reservations",
      "/user/services",
      "/user/support",
    ]

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
    const userRoutes = [
      "/",
      "/user/bookmanagement",
      "/user/researchmanagement",
      "/user/reservations",
      "/user/services",
      "/user/support",
    ]
    const restrictedRoutes = ["/user/reservations", "/user/services", "/user/support"]

    if (userType === "Guest" && restrictedRoutes.some((route) => path.startsWith(route))) {
      return false
    }

    if (["Admin", "Superadmin", "Intern"].includes(userType)) {
      return adminRoutes.some((route) => path.startsWith(route))
    }

    if (["Student", "Faculty", "Guest"].includes(userType)) {
      return userRoutes.some((route) => path.startsWith(route))
    }

    return false
  }

  // Better loading UI
  if (loading || (user === null && localStorage.getItem("user"))) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading user data...</div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, updateUser, loginAsGuest }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
