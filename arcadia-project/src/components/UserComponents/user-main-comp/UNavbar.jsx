import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../../backend/UserContext"; 
import { useNavigate } from "react-router-dom";
export default function UNavbar() {
  return (
    <div className="userNavbar-cont bg-white shadow-md">
      <nav className="flex justify-center items-center">
        <div className="userNavbar-content flex">
          <CustomLink to="/" className="userNav-link w-[150px] text-center">
            Home
          </CustomLink>
          <CustomLink to="/user/bookmanagement" className="userNav-link w-[150px] text-center">
            Book Catalog
          </CustomLink>
          <CustomLink to="/user/researchmanagement" className="userNav-link w-[150px] text-center">
            Research Catalog
          </CustomLink>
          <CustomLink to="/user/reservations" className="userNav-link w-[150px] text-center" restricted>
            Room Reservations
          </CustomLink>
          <CustomLink to="/user/services" className="userNav-link w-[150px] text-center" restricted>
            Services
          </CustomLink>
          <CustomLink to="/user/support" className="userNav-link w-[150px] text-center" restricted>
            Support
          </CustomLink>
        </div>
      </nav>
    </div>
  );
}

function CustomLink({ to, children, className, restricted, ...props }) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  const { user } = useUser();
  const navigate = useNavigate(); 

  const handleClick = (e) => {
    if (user?.userAccountType === "Guest" && restricted) {
      e.preventDefault();
      toast.warning("You need to log in first to access this page! Redirecting to Login...", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/user/login"); 
      }, 3000);
    }
  };
  
  return (
    <Link
      to={to}
      {...props}
      onClick={handleClick}
      className={`userNav-link px-2 py-3 text-white transition duration-200 ${
        isActive
          ? "bg-red font-semibold !text-white"
          : "hover:bg-grey hover:text-black"
      } ${className}`}
    >
      {children}
    </Link>
  );
}
