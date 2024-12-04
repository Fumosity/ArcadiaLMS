import { supabase } from '../../supabaseClient';
import React, { useState, useEffect } from "react";

const BksDueTdy = () => {
    const [booksDueToday, setBooksDueToday] = useState([]);

    useEffect(() => {
        const fetchBooksDueToday = async () => {
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
                    .eq('deadline', today.toISOString().split('T')[0]);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    console.log("Raw data from Supabase:", data); // Debugging: raw data from Supabase

                    const formattedData = data.map(item => {
                        const bookDetails = item.book_indiv?.book_titles || {};

                        const deadline = new Date(item.deadline).toLocaleDateString('en-US', {month: 'long',day: 'numeric'});
                        console.log("deadline today", item.deadline)

                        return {
                            bookTitle: bookDetails.title,
                            borrower: item.name,
                            bookId: item.bookID,
                            due: deadline,
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

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Books Due Today</h3>

            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {booksDueToday.length > 0 ? (
                        booksDueToday.map((book, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.bookTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.borrower}</td>
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
    );
};

export default BksDueTdy;
