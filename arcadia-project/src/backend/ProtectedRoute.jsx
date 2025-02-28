import { useUser } from "./UserContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!user || !user.userAccountType || user.userAccountType === "Guest") {
      if (!toastShown) {
        toast.warning(
          "You need to log in first to access this page! Redirecting to Login",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          }
        );
        setToastShown(true);

        setTimeout(() => setRedirect(true), 5000);
      }
    }
  }, [user, toastShown]);

  // 🚨 Prevent navigation BEFORE entering restricted page
  if (!user || !user.userAccountType || user.userAccountType === "Guest") {
    return redirect ? <Navigate to="/user/login" replace /> : null;
  }

  return children;
};

export default ProtectedRoute;
