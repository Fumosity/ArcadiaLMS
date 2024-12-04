import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import { useNavigate, Link } from "react-router-dom";

const BorrowedBks = () => {
    // State for sorting and filtering
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");
    const [entries, setEntries] = useState(10);
    const [typeOrder, setTypeOrder] = useState("Borrowed");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch borrowed books data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('book_transactions')
                .select(`
                    transaction_type, 
                    checkin_date, 
                    checkin_time, 
                    checkout_date, 
                    checkout_time,
                    deadline, 
                    userID, 
                    bookID, 
                    book_indiv(
                        bookID,
                        bookARCID,
                        status,
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
                    )`).eq('transaction_type', 'Borrowed'); // Only fetch 'Borrowed' transactions

            if (error) {
                console.error("Error fetching data:", error);
            } else {
                console.log("Borrowed data from Supabase:", data); // Debugging: raw data from Supabase

                // Format the fetched data
                const formattedData = data.map(item => {
                    const date = item.checkout_date;
                    const time = item.checkout_time;

                    let formattedTime = null;
                    if (time) {
                        // Ensure time is in the format HH:mm (24-hour format)
                        const timeString = time.includes(':') ? time : `${time.slice(0, 2)}:${time.slice(2)}`;

                        // Convert time into 12-hour format with AM/PM
                        formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString('en-PH', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        });
                    }

                    const bookDetails = item.book_indiv?.book_titles || {};

                    return {
                        type: item.transaction_type,
                        date,
                        time: formattedTime,
                        borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                        bookTitle: bookDetails.title,
                        bookId: item.bookID,
                        user_id: item.userID,
                        titleID: bookDetails.titleID,
                        deadline: item.deadline
                    };
                });

                setBorrowedBooks(formattedData); // Set formatted data
            }
            setLoading(false);
        };

        fetchData();
    }, []); // Empty dependency array to run only once when the component mounts

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = borrowedBooks.length; // Total number of entries
    const totalPages = Math.ceil(totalEntries / entries); // Total number of pages

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', // e.g., November
            day: 'numeric', // e.g., 24
        });
    };

    const handleUserClick = (book) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: book.user_id },
        });
    };

    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ borderRadius: "40px" }}>
            {/* Title */}
            <h3 className="text-xl font-semibold mb-4">Borrowed Books</h3>

            {/* Controls: Type, Sort by, Date Range, No. of Entries, Search */}
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                {/* Type */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Type:</span>
                    <span
                        className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {typeOrder}
                    </span>
                </div>

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
                        placeholder="Title, borrower, or ID"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead className="bg-gray-50 rounded-t-lg" style={{ borderRadius: "40px" }}>
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
                        {borrowedBooks.slice((currentPage - 1) * entries, currentPage * entries).map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td
                                    className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}>
                                    {book.type}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{book.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{book.time}</td>
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
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{book.bookId}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(book.deadline)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BorrowedBks;
