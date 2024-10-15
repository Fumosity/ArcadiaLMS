import React from "react";

// Reusable button component for consistent styling
const Button = ({ children, onClick, className, borderClassName }) => (
    <button
        onClick={onClick}
        className={`bg-gray-200 py-1 px-3 rounded-full text-xs hover:bg-gray-300 ${className} ${borderClassName}`}
        style={{ borderRadius: "40px" }}
    >
        {children}
    </button>
);

// Reusable table row component for admin actions
const TableRow = ({ type, date, time, borrower, bookTitle, bookID }) => {
    // Set background color based on type using ternary operators
    const backgroundColor = 
        type === 'Borrow' ? 'bg-yellow rounded-full' : 
        type === 'Returned' ? 'bg-green rounded-full' : 
        type === 'Overdue' ? 'bg-red rounded-full' : '';

    return (
        <div className={`w-full grid grid-cols-6 gap-4 items-center text-center text-sm text-gray-900 mb-2`}>
            <div className={`${backgroundColor} text-gray-800 py-1 px-3`}>{type}</div>
            <div>{date}</div>
            <div>{time}</div>
            <div className={`truncate max-w-xs`}>{borrower}</div>
            <div className={`truncate max-w-xs`}>{bookTitle}</div>
            <div>{bookID}</div>
        </div>
    );
};

const AUserCirc = () => {
    return (
        <>
            {/* Title and Navigation Button */}
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-zinc-900 text-xl font-semibold">User Circulation History</h2>
                <Button borderClassName="border border-gray-300">Go to Book Circulation</Button>
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
                        className="border border-grey rounded-md py-1 px-2 text-sm"
                        style={{ borderRadius: "40px" }}
                    />
                </div>
            </div>

            {/* Table Header */}
            <div className="w-full grid grid-cols-6 gap-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <div>Type</div>
                <div>Date</div>
                <div>Time</div>
                <div>Borrower</div>
                <div>Book Title</div>
                <div>Book ID</div>
            </div>
            <div className="w-full border-t border-grey mb-2"></div>

            {/* Table Rows with updated types */}
            <TableRow type="Borrow" date="August 23" time="1:24 PM" borrower="Alexander Corrine" bookTitle="Learning React" bookID="B001" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Returned" date="August 23" time="1:09 PM" borrower="Alexander Corrine" bookTitle="Data Science Basics" bookID="B002" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Overdue" date="August 23" time="2:00 PM" borrower="Alexander Corrine" bookTitle="Introduction to AI" bookID="B003" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Borrow" date="August 23" time="1:24 PM" borrower="Alexander Corrine" bookTitle="Learning React" bookID="B001" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Returned" date="August 23" time="1:09 PM" borrower="Alexander Corrine" bookTitle="Data Science Basics" bookID="B002" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Overdue" date="August 23" time="2:00 PM" borrower="Alexander Corrine" bookTitle="Introduction to AI" bookID="B003" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Borrow" date="August 23" time="1:24 PM" borrower="Alexander Corrine" bookTitle="Learning React" bookID="B001" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Returned" date="August 23" time="1:09 PM" borrower="Alexander Corrine" bookTitle="Data Science Basics" bookID="B002" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Overdue" date="August 23" time="2:00 PM" borrower="Alexander Corrine" bookTitle="Introduction to AI" bookID="B003" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Borrow" date="August 23" time="1:24 PM" borrower="Alexander Corrine" bookTitle="Learning React" bookID="B001" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Returned" date="August 23" time="1:09 PM" borrower="Alexander Corrine" bookTitle="Data Science Basics" bookID="B002" />
            <div className="w-full border-t border-grey mb-2"></div>
            <TableRow type="Overdue" date="August 23" time="2:00 PM" borrower="Alexander Corrine" bookTitle="Introduction to AI" bookID="B003" />
            <div className="w-full border-t border-grey mb-2"></div>
            
            
        </>
    );
};

export default AUserCirc;
