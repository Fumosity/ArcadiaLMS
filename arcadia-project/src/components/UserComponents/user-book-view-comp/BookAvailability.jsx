import React from "react";

export default function BookAvailability() {
    // Sample data for the book
    const book = {
        availability: "Is Available",
        arcFloor: "ARC 3rd Floor",
        roomLocation: "Senior High School Library",
        shelf: "Shelf M-Z",
        quantity: "Quantity in Inventory: 2",
    };

    return (
        <div className="uSidebar-cont">
            <h2 className="text-lg font-semibold mb-3">Availability</h2>
            
            <div className="flex mb-4 item-center justify-center text-center ">
                <span className="text-green font-semibold">✓</span>
                <span className="ml-2">{book.availability}</span>
            </div>

            <div className="item-center justify-center text-center text-black text-sm mb-2">
                <p>{book.arcFloor}</p>
                <p>{book.roomLocation}</p>
                <p>{book.shelf}</p>
            </div>

            <p className="item-center justify-center text-center text-sm mb-4">{book.quantity}</p>

            <button className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-0.5 px-4 rounded-xl text-sm">
                Make A Reservation
            </button>
        </div>
    );
}
