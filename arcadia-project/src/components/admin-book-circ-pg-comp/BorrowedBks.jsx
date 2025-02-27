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
                    transactionType, 
                    checkinDate, 
                    checkinTime, 
                    checkoutDate, 
                    checkoutTime,
                    deadline, 
                    userID, 
                    bookID, 
                    book_indiv(
                        bookID,
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
                    )`).eq('transactionType', 'Borrowed'); // Only fetch 'Borrowed' transactions

            if (error) {
                console.error("Error fetching data:", error);
            } else {
                console.log("Borrowed data from Supabase:", data); // Debugging: raw data from Supabase

                // Format the fetched data
                const formattedData = data.map(item => {
                    const date = item.checkoutDate;
                    const time = item.checkoutTime;

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
                        type: item.transactionType,
                        date,
                        time: formattedTime,
                        borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                        bookTitle: bookDetails.title,
                        bookBarcode: item.book_indiv.bookBarcode,
                        userId: item.userID,
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
            <h3 className="text-2xl font-semibold mb-2">Borrowed Books</h3>

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
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                        {borrowedBooks.length > 0 ? (
                            borrowedBooks.slice((currentPage - 1) * entries, currentPage * entries).map((book, index) => (
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{book.bookBarcode}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(book.deadline)}</td>
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
            )}

            {/* Pagination Controls */}
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

export default BorrowedBks;
