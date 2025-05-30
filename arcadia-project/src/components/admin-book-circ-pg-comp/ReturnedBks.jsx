import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const ReturnedBks = () => {
    const [sortOrder, setSortOrder] = useState("Descending");
    const [entries, setEntries] = useState(10);
    const [typeOrder, setTypeOrder] = useState("Returned");
    const [dateRange, setDateRange] = useState("After 2020");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [returnedData, setReturnedData] = useState([]);
    const totalEntries = returnedData.length;
    const totalPages = Math.ceil(totalEntries / entries);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Returned book data from Supabase
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
                        deadline, 
                        userID, 
                        bookBarcode, 
                        book_indiv(
                            bookBarcode,
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
                        )`)
                    .eq('transactionType', 'Returned'); // Only fetch 'Returned' transactions

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Returned data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        const date = item.checkinDate;
                        const time = item.checkinTime;

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
                            deadline: item.deadline
                        };
                    });

                    setReturnedData(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this will run once when the component mounts

    // Function to format the deadline to an English date
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
            <h3 className="text-2xl font-semibold mb-2">Returned Books</h3>
            <div className='overflow-x-auto'>
            <table className="min-w-full divide-y divide-gray-200 text-center">
                <thead className="bg-gray-50 rounded-t-lg" style={{ borderRadius: "40px" }}>
                    <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Barcode</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                    {returnedData.length > 0 ? (
                        returnedData.slice((currentPage - 1) * entries, currentPage * entries).map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                    ${book.type === "Returned" ? "bg-resolved" : ""}`}
                                >
                                    {book.type}</td>
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
                                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(book.deadline)}</td>
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

export default ReturnedBks;
