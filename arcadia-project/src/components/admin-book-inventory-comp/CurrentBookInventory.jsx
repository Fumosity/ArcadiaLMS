import React, { useState } from "react";

// Sample data
const inventoryData = [
    {
        category: "Fiction", 
        genre: "Novella", 
        bookTitle: "The Metamorphosis",
        author: "Franz Kafka",
        bookId: "B-04321",
        pubDate: "2021 (c. 1915)",
        qty: 2,
    },
    {
        category: "Non-fiction", 
        genre: "Novella", 
        bookTitle: "Vincent Vaughn Fadri",
        author: "Karl Marx",
        bookId: "B-04321",
        pubDate: "2021 (c. 1915)",
        qty: 2,
    },
];

const AdminCurrentInventory = () => {
    // State for sorting and filtering
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h3 className="text-2xl font-semibold mb-4">Current Inventory</h3>

            {/* Controls: Sort by, Pub. Date, Filter By */}
            <div className="flex flex-wrap items-center mb-6 space-x-4">
                {/* Sort by */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Sort By:</span>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")
                        }
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-sm"
                    >
                        {sortOrder}
                    </button>
                </div>

                {/* Pub. Date */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Pub. Date:</span>
                    <button
                        onClick={() =>
                            setPubDateFilter(
                                pubDateFilter === "After 2020"
                                    ? "After 2021"
                                    : pubDateFilter === "After 2021"
                                        ? "After 2022"
                                        : "After 2020"
                            )
                        }
                        className="bg-gray-200 py-1 px-3 rounded-full text-sm"
                    >
                        {pubDateFilter}
                    </button>
                </div>

                {/* Filter By */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Filter By:</span>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Category</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Genre</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Quantity</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="align-middle min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 ">
                        <tr>
                            {["Category", "Genres", "Book Title", "Author", "Book ID", "Pub. Date", "Qty."].map(
                                (header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bookinv-category w-24 h-7 inline-flex items-center justify-center text-sm font-medium rounded-full bg-gray-100">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bookinv-genre w-24 h-7 inline-flex items-center justify-center text-sm font-medium rounded-full bg-gray-100">
                                        {item.genre}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.bookTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.bookId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.pubDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCurrentInventory;
