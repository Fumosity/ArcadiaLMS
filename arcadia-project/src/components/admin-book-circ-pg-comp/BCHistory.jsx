import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select(`
                        transactionType, 
                        checkinDate, 
                        checkinTime, 
                        checkoutDate, 
                        checkoutTime, 
                        userID, 
                        bookBarcode, 
                        book_indiv(
                            bookBarcode,
                            bookARCID,
                            bookBarcode,
                            bookStatus,
                            book_titles (
                                titleID,
                                title,
                                price
                            )
                        ),
                        user_accounts (
                            userFName,
                            userLName,
                            userLPUID
                        )`);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("History data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        const date = item.checkinDate || item.checkoutDate;
                        const time = item.checkinTime || item.checkoutTime;

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

                        const bookDetails = item.book_indiv?.book_titles || {};

                        return {
                            type: item.transactionType,
                            date,
                            time: formattedTime,
                            borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                            bookTitle: bookDetails.title,
                            bookBarcode: item.book_indiv.bookBarcode,
                            userId: item.userID,
                            titleID: bookDetails.titleID,
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

    const handleUserClick = (book) => {
        console.log("userid", book.userId, "user", book.borrower, book)
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: book.userId, user: book },
        });
    };

    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            {/* Title */}
            <h3 className="text-2xl font-semibold mb-2">Book Circulation History</h3>

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
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Barcode</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((book, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}>
                                        {book.type}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{book.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{book.time}</td>
                                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                                        <button
                                            onClick={() => handleUserClick(book)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.borrower}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                                        <Link
                                            to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {truncateTitle(book.bookTitle)}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{book.bookBarcode}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="px-4 py-2 text-center">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-2 space-x-4">
                <button className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous Page
                </button>
                <span className="text-xs text-arcadia-red">Page {currentPage}</span>
                <button className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default BCHistory;
