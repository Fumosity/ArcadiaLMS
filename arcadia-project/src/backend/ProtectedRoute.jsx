import { useUser } from "./UserContext"
import { Navigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  const location = useLocation()
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    // Check if user is not logged in or is a guest
    if (!user || !user.userAccountType || user.userAccountType === "Guest") {
      // Show toast notification
      toast.warning("This page requires login. Redirecting to login page...", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
        onClose: (closedByUser) => {
          // Only redirect if toast was not manually closed
          if (!closedByUser) {
            setRedirect(true)
          }
        },
      })
    }
  }, [user])

  // If user is not logged in or is a guest and redirect is true, navigate to login
  if ((!user || !user.userAccountType || user.userAccountType === "Guest") && redirect) {
    return <Navigate to="/user/login" state={{ from: location }} replace />
  }

  // If user is not logged in or is a guest but redirect is false, render nothing (waiting for toast)
  if (!user || !user.userAccountType || user.userAccountType === "Guest") {
    return null
  }

  // If user is logged in and not a guest, render children
  return children
}

export default ProtectedRoute