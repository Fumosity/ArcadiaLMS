import React from "react";

const UCopyright = () =>(
    <div className="w-full border-white bg-arcadia-black py-4 px-6 flex justify-between items-center text-sm text-white">
            <div>
                Copyright © {new Date().getFullYear()} - Lyceum of the Philippines University Cavite
            </div>
            <div>
                All Rights Reserved - <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            </div>
        </div>
)
export default UCopyright;