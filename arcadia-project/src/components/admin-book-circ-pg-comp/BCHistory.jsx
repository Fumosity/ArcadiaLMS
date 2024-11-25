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
        // Fetch data from Supabase when the component mounts
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transaction_type, checkin_date, checkin_time, checkout_date, checkout_time, name, book_title, book_id');

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Raw data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        // Prioritize checkin values, fallback to checkout values
                        const date = item.checkin_date || item.checkout_date;
                        const time = item.checkin_time || item.checkout_time;

                        // Format the time if available
                        const formattedTime = time
                            ? new Date(`1970-01-01T${time}Z`).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })
                            : null;

                        return {
                            type: item.transaction_type,
                            date, // Use the dynamically selected date
                            time: formattedTime, // Use the dynamically selected time
                            borrower: item.name,
                            bookTitle: item.book_title,
                            bookId: item.book_id,
                        };
                    });

                    console.log("Formatted data:", formattedData); // Debugging: formatted data
                    setBkhistoryData(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };


        fetchData();
    }, []); // Empty dependency array means this will run once when the component mounts

    // Function to truncate the title if it's too long
    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ borderRadius: "40px" }}>
            {/* Title */}
            <h3 className="text-xl font-semibold mb-4">Book Circulation History</h3>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between mb-4 space-x-1">
                {/* Other controls */}
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
                        {bkhistoryData.slice((currentPage - 1) * entries, currentPage * entries).map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td
                                    className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                    ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}
                                > 
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
                {/* Pagination buttons */}
            </div>
        </div>
    );
};

export default BCHistory;
