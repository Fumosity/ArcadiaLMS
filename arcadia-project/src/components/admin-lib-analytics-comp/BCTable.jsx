import React, { useState } from "react";

const rtrndData = [
    {
        type: "Returned",
        date: "November 1",
        time: "12:15 PM",
        borrower: "Alex Jones",
        bookTitle: "Book of Revelations",
        bookId: "JADE-0422",
    },
    {
        type: "returned",
        date: "August 23",
        time: "10:00 AM",
        borrower: "Keith Thurman",
        bookTitle: "Moises' Fat Juice",
        bookId: "B450-PR0",
    },
    {
        type: "Returned",
        date: "January 1",
        time: "2:30 PM",
        borrower: "Von Fadri",
        bookTitle: "Chinese New Year",
        bookId: "TECH-211",
    },

    {
        type: "Returned",
        date: "September 11",
        time: "9:11 AM",
        borrower: "Vladimir Y.",
        bookTitle: "Terrorist Attacks",
        bookId: "TWN-101",
    },
];

const BCTable = () => {
    // State for sorting and filtering
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");
    const [entries, setEntries] = useState(10);
    const [typeFilter, setFilter] = useState("Type");
    const [typeOrder, setTypeOrder] = useState("Borrow");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = rtrndData.length; // Total number of entries
    const totalPages = Math.ceil(totalEntries / entries); // Total number of pages

    return (
        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
            {/* Title */}

            {/* Controls: Type, Sort by, Date Range, No. of Entries, Search */}
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                {/* Sort by */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")
                        }
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {sortOrder}
                    </button>
                </div>

                 {/* Filter */}
                 <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Filter By:</span>
                    <span
                        className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {typeOrder}
                    </span>
                    <span
                        className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {typeFilter}
                    </span>
                </div>


                {/* Search */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="search" className="text-sm">Search:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                        style={{ borderRadius: "40px" }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Title, borrower, or ID"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 rounded-t-lg" style={{ borderRadius: "40px" }}>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rtrndData.slice((currentPage - 1) * entries, currentPage * entries).map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.type}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.time}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.borrower}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.bookTitle}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{book.bookId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    style={{ borderRadius: "40px" }}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    style={{ borderRadius: "40px" }}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default BCTable;
