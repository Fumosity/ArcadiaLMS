import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";

const BCHistory = () => {
    const [sortOrder, setSortOrder] = useState("Descending");
    const [entries, setEntries] = useState(10);
    const [typeOrder, setTypeOrder] = useState("Borrowed");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [bkhistoryData, setBkhistoryData] = useState([]);
    const totalEntries = bkhistoryData.length;
    const totalPages = Math.ceil(totalEntries / entries);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transaction_type, checkin_date, checkin_time, checkout_date, checkout_time, name, book_title, book_id');

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    const formattedData = data.map(item => {
                        const date = item.checkin_date || item.checkout_date;
                        const time = item.checkin_time || item.checkout_time;
                    
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
                            type: item.transaction_type,
                            date,
                            time: formattedTime,
                            borrower: item.name,
                            bookTitle: item.book_title,
                            bookId: item.book_id,
                        };
                    });

                    setBkhistoryData(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
    }, []);

    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    // Filter and Sort logic
    const filteredData = bkhistoryData.filter(book =>
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.borrower.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting by both date and time (latest first for descending order)
    const sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.date + "T" + a.time);
        const dateB = new Date(b.date + "T" + b.time);

        // Sort in descending order for latest first
        return sortOrder === "Descending" ? dateB - dateA : dateA - dateB;
    });

    const paginatedData = sortedData.slice((currentPage - 1) * entries, currentPage * entries);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ borderRadius: "40px" }}>
            {/* Title */}
            <h3 className="text-xl font-semibold mb-4">Book Circulation History</h3>

            {/* Controls */}
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                {/* Type */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Type:</span>
                    <span className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs" style={{ borderRadius: "40px" }}>
                        {typeOrder}
                    </span>
                </div>

                {/* Sort By */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        onClick={() => setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")}
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {sortOrder}
                    </button>
                </div>

                {/* Date Range */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Date Range:</span>
                    <button
                        onClick={() => setDateRange(dateRange === "After 2020" ? "After 2021" : "After 2020")}
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
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
                        placeholder="Title or borrower"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                        {paginatedData.map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}>
                                    {book.type}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.date}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.time}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.borrower}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{truncateTitle(book.bookTitle)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{book.bookId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default BCHistory;
