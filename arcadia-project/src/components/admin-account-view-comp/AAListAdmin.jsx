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
const TableRow = ({ actionType, date, time, userName, userEmail }) => {
    // Set background color for Admin
    const backgroundColor = actionType === 'Admin' ? 'bg-yellow rounded-full' : '';

    return (
        <div className={`w-full grid grid-cols-5 gap-4 items-center text-center text-sm text-gray-900 mb-2`}>
            <div className={`${backgroundColor} text-gray-800 py-1 px-3`}>
                {actionType}
            </div>
            <div>{date}</div>
            <div>{time}</div>
            <div>{userEmail}</div>
            <div>{userName}</div>
        </div>
    );
};

const AAListAdmin = () => {
    return (
        <>
            {/* Title and Navigation Button */}
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-zinc-900 text-xl font-semibold">List of Admin Accounts</h2>
                <Button>Go to Book Circulation</Button>
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
            <div className="w-full grid grid-cols-5 gap-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <div>Type</div>
                <div>Email</div>
                <div>Name</div>
                <div>User ID</div>
                <div>School ID</div>
            </div>
            <div className="w-full border-t border-grey mb-2"></div>

            {/* Table Rows */}
            <TableRow actionType="Admin" date="August 23" time="1:24 PM" userName="Alexander Corrine" userEmail="alexander@example.com" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow actionType="Admin" date="August 23" time="1:09 PM" userName="Alexander Corrine" userEmail="alexander@example.com" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow actionType="Admin" date="August 23" time="2:00 PM" userName="Alexander Corrine" userEmail="alexander@example.com" />
            <div className="w-full border-t border-grey mb-2"></div>

            {/* Additional rows can be added here */}
        </>
    );
};

export default AAListAdmin;
