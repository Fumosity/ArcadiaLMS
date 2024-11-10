import React from "react";
import TicketResponse from "./TicketResponse";

const TicketDetails = () => {
    return (
        <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">

            <h3 className="text-lg font-semibold mb-4">Make a Report</h3>
            <div className="flex items-center mb-4">
                <label className="text-sm mr-2 font-semibold">Type:</label>
                <select
                    className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
                    defaultValue="book"
                    disabled
                >
                    <option value="select-type" className="text-center text-grey">Select Type</option>
                    <option value="system" className="text-center">System</option>
                    <option value="book" className="text-center">Book</option>
                    <option value="feedback" className="text-center">Research</option>
                </select>

                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg
                        className="w-4 h-4 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </span>

                <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
                <input
                    type="text"
                    className="flex-1 px-2 py-1 border border-grey rounded-full text-sm text-right placeholder-black"
                    placeholder="Book Borrow Extension"
                    onKeyDown={(e) => e.preventDefault()}
                />
            </div>
            <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
            <textarea
                className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
                placeholder="Good day, I want to extend my temporary ownership of the book “Robinson Crusoe”"
                onKeyDown={(e) => e.preventDefault()}
            ></textarea>

            <TicketResponse />

        </div>
    )
};

export default TicketDetails;