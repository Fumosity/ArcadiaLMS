import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      navigateBasedOnRole(storedUser.userAccountType);
    }
  }, []);

  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      navigateBasedOnRole(newUser.userAccountType);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/"); // Redirect to home if logged out
    }
  };

  const navigateBasedOnRole = (userAccountType) => {
    if (["Admin", "Superadmin", "Intern"].includes(userAccountType)) {
      navigate("/admin");
    } else if (["Student", "Teacher"].includes(userAccountType)) {
      navigate("/");
    } else {
      alert("Unknown account type. Please contact support.");
      navigate("/");
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
