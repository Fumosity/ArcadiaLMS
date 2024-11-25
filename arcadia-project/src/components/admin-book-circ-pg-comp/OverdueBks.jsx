import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";

const OverdueBks = () => {
    const [sortOrder, setSortOrder] = useState("Descending");
    const [entries, setEntries] = useState(10);
    const [typeOrder, setTypeOrder] = useState("Overdue");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [overdueData, setOverdueData] = useState([]);

    const totalEntries = overdueData.length;
    const totalPages = Math.ceil(totalEntries / Number(entries));

    useEffect(() => {
        // Fetch overdue book data from Supabase
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transaction_type, checkout_date, checkout_time, name, book_title, book_id, deadline')
                    .lt('deadline', new Date().toISOString()); // Fetch records where the deadline is past the current date

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Raw data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        const date = item.checkout_date;
                        const time = item.checkout_time;

                        let formattedTime = null;
                        if (time) {
                            // Ensure time is in the format HH:mm (24-hour format)
                            const timeString = time.includes(':') ? time : `${time.slice(0, 2)}:${time.slice(2)}`;

                            // Convert time into 12-hour format with AM/PM, no 'Z' for local time
                            formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString('en-PH', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            });
                        }

                        return {
                            type: "Overdue", // Always set to "Overdue" for overdue entries
                            date,
                            time: formattedTime,
                            borrower: item.name,
                            bookTitle: item.book_title,
                            bookId: item.book_id,
                            deadline: item.deadline, // Use the deadline column from Supabase
                        };
                    });

                    setOverdueData(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this will run once when the component mounts

    // Filter books by search term
    const filteredData = overdueData
        .filter(book =>
            book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.bookId.toString().includes(searchTerm)
        )
        // Filter by date range
        .filter(book => {
            if (dateRange === "After 2020") {
                return new Date(book.deadline).getFullYear() > 2020;
            } else if (dateRange === "Before 2020") {
                return new Date(book.deadline).getFullYear() <= 2020;
            }
            return true;
        })
        // Filter by type order (Overdue in this case)
        .filter(book => book.type === typeOrder)
        // Sort by date
        .sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            if (sortOrder === "Descending") {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });

    // Truncate long titles
    const truncateTitle = (title, maxLength = 25) =>
        title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;

    // Format date for display
    const formatDate = dateString =>
        new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
        });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ borderRadius: "40px" }}>
            <h3 className="text-xl font-semibold mb-4">Overdue Books</h3>

            {/* Controls Section */}
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                {/* Type */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Type:</span>
                    <span className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs" style={{ borderRadius: "40px" }}>
                        {typeOrder}
                    </span>
                </div>

                {/* Sort by */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        onClick={() => setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")}
                        className="bg-gray-200 py-1 px-3 rounded-full text-xs hover:bg-gray-300"
                        style={{ borderRadius: "40px" }}
                    >
                        {sortOrder}
                    </button>
                </div>

                {/* Date Range */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Date Range:</span>
                    <button
                        onClick={() =>
                            setDateRange(
                                dateRange === "After 2020"
                                    ? "After 2021"
                                    : dateRange === "After 2021"
                                    ? "After 2022"
                                    : "After 2020"
                            )
                        }
                        className="bg-gray-200 py-1 px-3 rounded-full text-xs hover:bg-gray-300"
                        style={{ borderRadius: "40px" }}
                    >
                        {dateRange}
                    </button>
                </div>

                {/* No. of Entries */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="entries" className="text-sm">No. of Entries:</label>
                    <input
                        type="number"
                        id="entries"
                        min="1"
                        value={entries}
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                        style={{ borderRadius: "40px", width: "80px" }}
                        onChange={(e) => setEntries(e.target.value)}
                    />
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
            <table className="min-w-full divide-y divide-gray-200 text-center">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                    {filteredData
                        .slice((currentPage - 1) * Number(entries), currentPage * Number(entries))
                        .map((book, index) => (
                            <tr key={index}>
                                <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Overdue" ? "bg-red" : ""}`}>{book.type}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.date}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.time}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.borrower}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{truncateTitle(book.bookTitle)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.bookId}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(book.deadline)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="py-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="py-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OverdueBks;
