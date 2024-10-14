import React from "react";

const MostPop = () => {
    const dataMostPop = [
        { book: "Von Fadri", rating: "1D3" },
        { book: "Von Fadri", rating: "1D3" },
        { book: "Von Fadri", rating: "1D3" }
    ];
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Most Popular Books</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">Books</th>
                        <th className="font-semibold pb-1 border-b border-grey">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {dataMostPop.map((book, index) => (
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
export default MostPop;