import React from "react";
import { Link, useMatch, useResolvedPath} from "react-router-dom";

export default function Navbar(){
  return(
  <div className="navbar-cont bg-white py-2 shadow-md">
    <nav className="flex justify-center items-center px-4">
      <div className="navbar-content flex">
        <CustomLink to="/admin" className="nav-link">Home</CustomLink>
        <CustomLink to="/admin/analytics" className="nav-link">Analytics</CustomLink>
        <CustomLink to="/admin/circulatoryhistory" className="nav-link">Circulation History</CustomLink>
        <CustomLink to="/admin/bookmanagement" className="nav-link">Book Management</CustomLink>
        <CustomLink to="/admin/researchmanagement" className="nav-link">Research Management</CustomLink>
        <CustomLink to="/admin/useraccounts" className="nav-link">User Accounts</CustomLink>
        <CustomLink to="/admin/support" className="nav-link">Support</CustomLink>
        <CustomLink to="/admin/reservations" className="nav-link">Reservations</CustomLink>
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
