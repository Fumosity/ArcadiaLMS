import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function UNavbar() {
  return (
    <div className="userNavbar-cont bg-white shadow-md">
      <nav className="flex justify-center items-center">
        <div className="userNavbar-content flex">
          <CustomLink to="/" className="userNav-link w-[150px] text-center hover:text-white">Home</CustomLink>
          <CustomLink to="/user/bookmanagement" className="userNav-link w-[150px] text-center">Book Catalog</CustomLink>
          <CustomLink to="/user/researchmanagement" className="userNav-link w-[150px] text-center">Research Catalog</CustomLink>
          <CustomLink to="/user/newsupdates" className="userNav-link w-[150px] text-center">News and Updates</CustomLink>
          <CustomLink to="/user/reservations" className="userNav-link w-[150px] text-center">Reservations</CustomLink>
          <CustomLink to="/user/services" className="userNav-link w-[150px] text-center">Services</CustomLink>
          <CustomLink to="/user/support" className="userNav-link w-[150px] text-center">Support</CustomLink>
        </div>
      </nav>
    </div>
  );
}

function CustomLink({ to, children, className, ...props }) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });

  return (
    <Link
      to={to}
      {...props}
      className={`userNav-link px-2 py-3 text-white transition duration-200 ${
        isActive
        ? "bg-red text-white font-semibold !text-white" //Force text-white with !text-white
        : "hover:bg-grey hover:text-black" // Hover styling
      } ${className}`}
    >
      {children}
    </Link>
  );
}
