import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BksDueTdy = () => {
    const [booksDueToday, setBooksDueToday] = useState([]);

    useEffect(() => {
        const fetchBooksDueToday = async () => {
            try {
                const today = new Date();
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
                    .eq('deadline', today.toISOString().split('T')[0]);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Raw data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        const bookDetails = item.book_indiv?.book_titles || {};
                        const bookBorrower = `${item.user_accounts.userFName} ${item.user_accounts.userLName}`
                        const deadline = new Date(item.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                        console.log("deadline today", item.deadline)
                        console.log("bookDetails", bookDetails)

                        return {
                            bookTitle: bookDetails.title,
                            borrower: bookBorrower,
                            bookBarcode: item.bookBarcode,
                            due: deadline,
                            titleID: bookDetails.titleID
                        };
                    });

                    setBooksDueToday(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchBooksDueToday();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    const handleUserClick = (record) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: record.user_id },
        });
    };

    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border w-full">
            <h3 className="text-2xl font-semibold">Books Due Today</h3>
            <div className='overflow-auto'>
                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 w-1/2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                            <th className="px-4 w-1/2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {booksDueToday.length > 0 ? (
                            booksDueToday.map((book, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="w-2/3 px-4 py-2 text-left text-sm  text-arcadia-red font-semibold">
                                        <button
                                            onClick={() => handleUserClick(book.userID)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {book.borrower}
                                        </button>
                                    </td>
                                    <td className="w-1/3 px-4 py-2 text-center text-sm text-arcadia-red font-semibold truncate">
                                        <Link
                                            to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {truncateTitle(book.bookTitle)}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No books due today.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BksDueTdy;
