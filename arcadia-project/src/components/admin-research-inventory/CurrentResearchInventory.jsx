import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js"; // Import your Supabase client
import { Link } from "react-router-dom"; // Import Link

const CurrentResearchInventory = ({ onResearchSelect }) => {
    const [inventoryData, setInventoryData] = useState([]);
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");

    useEffect(() => {
        const fetchResearch = async () => {
            const { data, error } = await supabase  
                .from('research') // Fetch from 'research' table
                .select('*');

            if (error) {
                console.error("Error fetching research:", error);
            } else {
                setInventoryData(data);
            }
        };

        fetchResearch();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mr-5">
            <h3 className="text-xl font-semibold mb-4">Current Research Inventory</h3>

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
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["College", "Department", "Title", "Authors", "Thesis ID", "Pub. Date"].map(
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
                        {inventoryData.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => onResearchSelect(item)} // Keep the existing onClick handler
                            >
                                <td className="px-4 py-4 text-sm text-gray-900">
                                    {item.college}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                    {item.department}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                    <Link 
                                        to={`/researchviewer?title=${encodeURIComponent(item.title)}`} // Pass title in query params
                                        className="text-blue-600 hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                    {item.authors}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {item.thesisID}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {item.pubDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CurrentResearchInventory;
