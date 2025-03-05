import { useUser } from "./UserContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!user || !user.userAccountType || user.userAccountType === "Guest") {
      setTimeout(() => setRedirect(true), 5000);
    }
  }, [user]);

  if (!user || !user.userAccountType || user.userAccountType === "Guest") {
    return redirect ? <Navigate to="/user/login" replace /> : null;
  }

  return children;
};

export default ProtectedRoute;
