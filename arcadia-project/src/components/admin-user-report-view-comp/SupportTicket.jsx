import React from "react";

// Reusable button component for consistent styling
const Button = ({ children, onClick, className }) => (
    <button
        onClick={onClick}
        className={`bg-gray-200 py-1 px-3 rounded-full text-xs hover:bg-gray-300 ${className}`}
        style={{ borderRadius: "40px" }}
    >
        {children}
    </button>
);

// Reusable table row component for admin actions
const TableRow = ({ type, date, time, userName, userEmail, userID, reportID }) => {
    // Set background color for specific types
    const backgroundColor = 
        type === 'Book' ? 'bg-yellow rounded-full' :
        type === 'Research' ? 'bg-yellow rounded-full' :
        type === 'Admin' ? 'bg-yellow rounded-full' :
        type === 'User' ? 'bg-yellow rounded-full' :
        '';
    return (
        <div className={`w-full grid grid-cols-7 gap-4 items-center text-center text-sm text-gray-900 mb-2`}>
            <div className={`${backgroundColor} text-gray-800 py-1 px-3`}>{type}</div>
            <div>{date}</div>
            <div>{time}</div>
            <div className={`truncate max-w-xs`}>{userEmail}</div>
            <div>{userName}</div>
            <div>{userID}</div>
            <div>{reportID}</div>
        </div>
    );
};

const SupportTicket = () => {
    return (
        <>
            {/* Title and Navigation Button */}
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-zinc-900 text-xl font-semibold">Support Tickets</h2>
            </div>

            {/* Sorting and Filtering Section */}
            <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <Button>Descending</Button>
                    <span className="font-medium text-sm">Filter By:</span>
                    <Button>Type</Button>
                    <Button>College</Button>
                    <Button>Department</Button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Search:</span>
                    <input
                        type="text"
                        placeholder="A title, borrower, or ID"
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                        style={{ borderRadius: "40px" }}
                    />
                </div>
            </div>

            {/* Table Header */}
            <div className="w-full grid grid-cols-7 gap-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <div>Type</div>
                <div>Date</div>
                <div>Time</div>
                <div>Email</div>
                <div>Name</div>
                <div>User ID</div>
                <div>Report ID</div>
            </div>
            <div className="w-full border-t border-grey mb-2"></div>

            {/* Table Rows with updated types */}
            <TableRow type="Book" date="August 23" time="1:24 PM" userName="Alexander Corrine" userEmail="alexander@example.com" userID="12345" reportID="7853" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Research" date="August 23" time="1:09 PM" userName="Alexander Corrine" userEmail="alexander@example.com" userID="12346" reportID="3456" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="User" date="August 23" time="2:00 PM" userName="Alexander Corrine" userEmail="alexander@example.com" userID="12347" reportID="6753" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Admin" date="August 23" time="2:00 PM" userName="Alexander Corrine" userEmail="alexander@example.com" userID="12347" reportID="4567" />
            <div className="w-full border-t border-grey mb-2"></div>
            
        </>
    );
};

export default SupportTicket;
