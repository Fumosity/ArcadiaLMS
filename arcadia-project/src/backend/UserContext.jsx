import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      navigateBasedOnRole(user.userAccountType);
    }
  }, [user]);

  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/user/login");
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      userID: 0,
      name: "Guest",
      userAccountType: "Guest",
    };
    updateUser(guestUser);
  };

  const navigateBasedOnRole = (userAccountType) => {
    if (!userAccountType) {
      navigate("/user/login");
      return;
    }
    switch (userAccountType) {
      case "Admin":
      case "Superadmin":
      case "Intern":
        navigate("/admin");
        break;
      case "Student":
      case "Teacher":
        navigate("/");
        break;
      case "Guest":
        navigate("/user/bookcatalog");
        break;
      default:
        navigate("/user/login");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <UserContext.Provider value={{ user, updateUser, loginAsGuest }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
