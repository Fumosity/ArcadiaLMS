import React from "react";

export default function RsrchAvailability() {
    // Sample data for the book
    const rsrch = {
        availability: "Is Available",
        arcFloor: "ARC 1st Floor",
        roomLocation: "Research Library",
        shelf: "DCS Shelf",
        quantity: "Quantity in Inventory: 1",
    };

    return (
        <div className="uSidebar-cont">
            <h2 className="text-lg font-semibold mb-3">Availability</h2>
            
            <div className="flex mb-4 item-center justify-center text-center ">
                <span className="text-green font-semibold">✓</span>
                <span className="ml-2">{rsrch.availability}</span>
            </div>

            <div className="item-center justify-center text-center text-black text-sm mb-2">
                <p>{rsrch.arcFloor}</p>
                <p>{rsrch.roomLocation}</p>
                <p>{rsrch.shelf}</p>
            </div>

            <p className="item-center justify-center text-center text-sm mb-4">{rsrch.quantity}</p>

            <button className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-0.5 px-4 rounded-xl text-sm">
                Contact the Help Desk
            </button>
        </div>
    );
}
