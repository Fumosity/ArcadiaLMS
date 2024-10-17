import React from "react";

const booksDueTodayData = [
    {
        date: "October 10",
        borrower: "Alex Jones",
        bookTitle: "Book of Revelations",
        bookId: "JADE-0422",
        due: "October 10",
    },
    {
        date: "October 10",
        borrower: "Keith Thurman",
        bookTitle: "Moises' Fat Juice",
        bookId: "B450-PR0",
        due: "October 10",
    },
    {
        date: "October 10",
        borrower: "Von Fadri",
        bookTitle: "Chinese New Year",
        bookId: "TECH-211",
        due: "October 10",
    },
    {
        date: "October 10",
        borrower: "Vladimir Y.",
        bookTitle: "Terrorist Attacks",
        bookId: "TWN-101",
        due: "October 10",
    },
];

const BksDueTdy = () => {
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
                    {booksDueTodayData.map((book, index) => (
                        <tr key={index} className="hover:bg-gray-100">

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.bookTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.borrower}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BksDueTdy;
