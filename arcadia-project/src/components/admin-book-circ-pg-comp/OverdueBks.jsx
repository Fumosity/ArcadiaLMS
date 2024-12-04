import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const OverdueBks = () => {
    const [sortOrder, setSortOrder] = useState("Descending");
    const [entries, setEntries] = useState(10);
    const [typeOrder, setTypeOrder] = useState("Overdue");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [overdueData, setOverdueData] = useState([]);
    const navigate = useNavigate();

    const totalEntries = overdueData.length;
    const totalPages = Math.ceil(totalEntries / Number(entries));

    useEffect(() => {
        // Fetch overdue book data from Supabase
        const fetchData = async () => {
            try {
                const today = new Date();
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
                        )`)
                        .not('deadline', 'is.null')
                        .lt('deadline', today.toISOString().split('T')[0]);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Overdue data from Supabase:", data); // Debugging: raw data from Supabase

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

                        const bookDetails = item.book_indiv?.book_titles || {};

                        return {
                            type: "Overdue",
                            date,
                            time: formattedTime,
                            borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                            bookTitle: bookDetails.title,
                            bookId: item.bookID,
                            userId: item.userID,
                            titleID: bookDetails.titleID,
                            deadline: item.deadline
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

    // Format date for display
    const formatDate = dateString =>
        new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
        });

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
                {overdueData.length > 0 ? (
                    overdueData.slice((currentPage - 1) * Number(entries), currentPage * Number(entries)).map((book, index) => (
                            <tr key={index}>
                                <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Overdue" ? "bg-red" : ""}`}>{book.type}</td>
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
                                <td className="px-4 py-3 text-sm text-gray-900">{book.bookId}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(book.deadline)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-4 py-2 text-center">
                                No data available.
                            </td>
                        </tr>
                    )}
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
