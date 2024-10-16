import React from "react";
import { Link, useMatch, useResolvedPath} from "react-router-dom";

export default function UNavbar(){
  return(
  <div className="userNavbar-cont bg-white py-2 shadow-md">
    <nav className="flex justify-center items-center px-4">
      <div className="userNavbar-content flex">
        <CustomLink to="/" className="userNav-link">Home</CustomLink>
        <CustomLink to="/bookmanagement" className="userNav-link">Book Catalog</CustomLink>
        <CustomLink to="/researchmanagement" className="userNav-link">Research Catalog</CustomLink>
        <CustomLink to="/reservations" className="userNav-link">News and Updates</CustomLink>
        <CustomLink to="/reservations" className="userNav-link">Reservations</CustomLink>
        <CustomLink to="/reservations" className="userNav-link">Services</CustomLink>
        <CustomLink to="/cafe" className="userNav-link">Support</CustomLink>
      </div>
    </nav>
  </div>)
}

function CustomLink({ to, children, ...props }){
  const resolvePath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvePath.pathname, end: true})
  return (
    <Link 
        to={to} {...props} className="nav-link">{children}
    </Link>
  )
}
