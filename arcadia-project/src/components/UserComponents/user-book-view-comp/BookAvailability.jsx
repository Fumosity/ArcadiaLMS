import { React, useEffect, useState } from "react";

export default function BookAvailability({ book }) {
    return (
        <div className="uSidebar-filter">
            <div className="flex justify-between items-center mb-2.5">
                <h2 className="text-xl font-semibold">Availability</h2>
            </div>

            <div className="flex m-6 item-center justify-center text-center ">
                {book.book_indiv.some(indivBook => indivBook.bookStatus === "Available") ? (
                    <div className="text-lg">
                        <span className="text-green font-semibold">✓</span>
                        <span className="ml-2">Book is Available</span>
                    </div>
                ) : (
                    <div className="text-lg">
                        <span className="text-red font-semibold">✗</span>
                        <span className="ml-2">Book is Unavailable</span>
                    </div>
                )}
            </div>

            <p className="w-full text-center text-md mb-4">Number available: {book.book_indiv.filter(indivBook => indivBook.bookStatus === "Available").length}</p>


            <div className="item-center justify-center text-center text-black mb-2">
                <p className="text-sm">Call Number:</p>
                <h4 className="text-lg font-semibold mb-2">{book.arcID}</h4>
                <p className="text-sm">Location:</p>
                <h4 className="text-md">{book.location}</h4>
            </div>

            <p className="item-center justify-center text-center text-sm mb-4">{book.quantity}</p>

            <button className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-4 rounded-xl text-sm">
                Make A Reservation
            </button>
        </div>
    );
}
