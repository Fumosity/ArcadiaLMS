import React from "react";

export default function RsrchAvailability({ research }) {
    console.log(research)

    const callNo = research.researchARCID
    console.log(callNo)
    const callNoPrefix = callNo.split("-")[0].trim();
    console.log(callNoPrefix)
    let currentLocation = ""

    if (!isNaN(callNoPrefix)) {
        // If callNoPrefix is a number  
        currentLocation = "4th Floor, Highschool and Multimedia Section";
    } else {
        // Extract year from pubDate (assuming it's a string in "yyyy-mm-dd" format)
        const pubYear = parseInt(research.pubDate.split("-")[0], 10);

        if (pubYear <= 2009) {
            currentLocation = "4th Floor, Circulation Section";
        } else {
            currentLocation = "2nd Floor, Circulation Section";
        }
    }

    return (
        <div className="uSidebar-filter">
            <div className="flex justify-between items-center mb-2.5">
                <h2 className="text-xl font-semibold">Availability</h2>
            </div>

            <div className="flex m-6 item-center justify-center text-center ">
                <div className="text-lg">
                    <span className="text-green font-semibold">✓</span>
                    <span className="ml-2">Paper is Available</span>
                </div>
            </div>

            <div className="item-center justify-center text-center text-black mb-2">
                <p className="text-sm">Call Number:</p>
                <h4 className="text-lg font-semibold mb-2">{research.researchARCID}</h4>
                <p className="text-sm">Location:</p>
                <h4 className="text-md">{currentLocation}</h4>
            </div>

            <button className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-4 rounded-xl text-sm">
                Contact the Help Desk
            </button>
        </div>
    );
}
