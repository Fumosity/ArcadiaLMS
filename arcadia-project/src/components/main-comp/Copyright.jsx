import React from "react";

const Copyright = () =>(
    <div className="w-full border-gray-200 py-4 px-6 flex justify-between items-center text-sm text-gray-600">
            <div>
                Copyright © {new Date().getFullYear()} - Lyceum of the Philippines University Cavite
            </div>
            <div>
                All Rights Reserved - <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            </div>
        </div>
)
export default Copyright;