import { Link } from "react-router-dom";
import React from "react";

const UCopyright = () =>(
    <div className="w-full border-white bg-arcadia-black py-4 px-6 flex justify-between items-center text-sm text-white">
            <div>
                Copyright © {new Date().getFullYear()} - Lyceum of the Philippines University Cavite
            </div>
            <div>
                All Rights Reserved - <Link 
                to="/user/privacypolicy" 
                className="hover:underline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                Privacy Policy</Link>
            </div>
        </div>
)
export default UCopyright;