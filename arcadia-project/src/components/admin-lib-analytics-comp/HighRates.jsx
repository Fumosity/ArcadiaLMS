import React from "react";

const HighRates = () => {
    const UserReports = [
        { book: "Keith Thurman", rating: "321"},
        { book: "Keith Thurman", rating: "321"},
        { book: "Keith Thurman", rating: "321"}
    ];
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Highest Rated Books</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">Book</th>
                        <th className="font-semibold pb-1 border-b border-grey">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {UserReports.map((book, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="py-2">{book.book}</td>
                            <td className="py-2">{book.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HighRates;