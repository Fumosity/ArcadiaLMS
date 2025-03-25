import { Link } from "react-router-dom";
import React from "react";

const Copyright = () =>(
    <div className="w-full  py-4 px-6 flex justify-between items-center text-sm text-gray-600 bg-arcadia-black text-white">
            <div className="text-white">
                Copyright © {new Date().getFullYear()} - Lyceum of the Philippines University Cavite
            </div>
            <div className="text-white">
                All Rights Reserved - <Link 
                to="/admin/data-privacy" className="hover:underline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                Privacy Policy</Link>
            </div>
        </div>
)
export default Copyright;