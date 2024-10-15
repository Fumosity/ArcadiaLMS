import React from "react";
import { Link, useMatch, useResolvedPath} from "react-router-dom";

export default function Navbar(){
  return(
  <div className="navbar-cont bg-white py-2 shadow-md">
    <nav className="flex justify-center items-center px-4">
      <div className="navbar-content flex">
        <CustomLink to="/" className="nav-link">Home</CustomLink>
        <CustomLink to="/analytics" className="nav-link">Analytics</CustomLink>
        <CustomLink to="/circulatoryhistory" className="nav-link">Circulatory History</CustomLink>
        <CustomLink to="/bookmanagement" className="nav-link">Book Management</CustomLink>
        <CustomLink to="/researchmanagement" className="nav-link">Research Management</CustomLink>
        <CustomLink to="/useraccounts" className="nav-link">User Accounts</CustomLink>
        <CustomLink to="/support" className="nav-link">Support</CustomLink>
        <CustomLink to="/reservations" className="nav-link">Reservations</CustomLink>
        <CustomLink to="/cafe" className="nav-link">Cafe</CustomLink>
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
