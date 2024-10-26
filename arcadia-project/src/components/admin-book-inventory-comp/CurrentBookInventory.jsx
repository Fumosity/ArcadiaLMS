import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";
import { Link } from "react-router-dom"; // Import Link

const CurrentBookInventory = ({ onBookSelect }) => {
    const [inventoryData, setInventoryData] = useState([]);
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");
    const [hoveredGenreIndex, setHoveredGenreIndex] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase  
                .from('book')
                .select('*');

            if (error) {
                console.error("Error fetching books:", error);
            } else {
                setInventoryData(data);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mr-5">
            <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>

            <div className="flex flex-wrap items-center mb-6 space-x-4">
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

                <div className="flex items-center space-x-2">
                    <span className="font-medium">Filter By:</span>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Category</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Genre</button>
                    <button className="bg-gray-200 py-1 px-3 rounded-full text-sm">Quantity</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Category", "Genres", "Book Title", "Author", "Book ID", "Original Pub. Date", "Qty."].map(
                                (header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryData.map((item, index) => {
                            const genres = item.genre.split(";");

                            return (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onBookSelect(item)} // Keep the existing onClick handler
                                >
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <span
                                                className={`bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border border-gray-300 p-1 ${hoveredGenreIndex === index ? 'bg-gray-200' : ''}`}
                                                onMouseEnter={() => setHoveredGenreIndex(index)}
                                                onMouseLeave={() => setHoveredGenreIndex(null)}
                                            >
                                                {genres[0]}
                                            </span>
                                            {genres.length > 1 && (
                                                <span
                                                    className={`bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border border-gray-300 p-1 ml-1 ${hoveredGenreIndex === index ? 'bg-gray-200' : ''}`}
                                                    onMouseEnter={() => setHoveredGenreIndex(index)}
                                                    onMouseLeave={() => setHoveredGenreIndex(null)}
                                                >
                                                    ...
                                                </span>
                                            )}
                                        </div>
                                        {hoveredGenreIndex === index && genres.length > 1 && (
                                            <div className="mt-1">
                                                {genres.slice(1).map((genre, i) => (
                                                    <div key={i} className="border border-gray-300 rounded p-1 mt-1 text-sm">
                                                        {genre}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        <Link 
                                            to={`/abviewer?title=${encodeURIComponent(item.title)}`} // Pass title in query params
                                            className="text-blue-600 hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        {item.author}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        {item.bookID}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        {item.originalPubDate}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        {item.quantity}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CurrentBookInventory;
