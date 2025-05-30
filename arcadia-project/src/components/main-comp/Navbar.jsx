import React from "react";
import { Link, useMatch, useResolvedPath} from "react-router-dom";

export default function Navbar(){
  return(
  <div className="navbar-cont bg-white py-2 shadow-md">
    <nav className="flex justify-center items-center px-4">
      <div className="navbar-content flex">
        <CustomLink to="/admin" className="nav-link">Home</CustomLink>
        {/* <CustomLink to="/admin/analytics" className="nav-link">Analytics</CustomLink> */}
        <CustomLink to="/admin/circulationhistory" className="nav-link">Circulation History</CustomLink>
        <CustomLink to="/admin/bookmanagement" className="nav-link">Book Management</CustomLink>
        <CustomLink to="/admin/researchmanagement" className="nav-link">Research Management</CustomLink>
        <CustomLink to="/admin/useraccounts" className="nav-link">User Accounts</CustomLink>
        <CustomLink to="/admin/support" className="nav-link">Support</CustomLink>
        <CustomLink to="/admin/reservations" className="nav-link">Room Reservations</CustomLink>
        <CustomLink to="/admin/systemreports" className="nav-link">System Reports</CustomLink>
        <CustomLink to="/admin/schedule" className="nav-link">Schedule</CustomLink>
        <CustomLink to="/admin/adminservices" className="nav-link">Content Management</CustomLink>
      </div>
    </nav>
  </div>)
}

function CustomLink({ to, children, ...props }) {
  const resolvePath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvePath.pathname, end: true })

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top
  }

  return (
    <Link 
      to={to}
      onClick={handleClick}
      {...props}
      className={`nav-link ${isActive ? "font-semibold text-arcadia-red" : ""}`}
    >
      {children}
    </Link>
  )
}
