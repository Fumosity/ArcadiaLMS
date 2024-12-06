import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js"; 
import { Link } from "react-router-dom"; 
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CurrentResearchInventory = ({ onResearchSelect }) => {
    const [inventoryData, setInventoryData] = useState([]);
    const [sortOrder, setSortOrder] = useState("Descending");
    const [pubDateFilter, setPubDateFilter] = useState("After 2020");
    const [selectedResearch, setSelectedResearch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchResearch = async () => {
            setIsLoading(true);
            try { 
                const { data, error } = await supabase  
                .from('research') // Fetch from 'research' table
                .select("researchID, title, college, department, abstract, location, researchARCID, pubDate, cover, author, keyword, pages");

                if (error) {
                    console.error("Error fetching research:", error);
                    return;
                }

                console.log("Fetched research data:", data);
                setInventoryData(data);
            } catch (error) {
                console.error("Unexpected error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResearch();
    }, []);

    const totalPages = Math.ceil(inventoryData.length / itemsPerPage);
    const paginatedData = inventoryData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRowClick = (research) => {
        setSelectedResearch(research);
        if (onResearchSelect) {
            onResearchSelect(research); // Pass the selected research to parent
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: itemsPerPage }).map((_, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        <Skeleton className="w-24" />
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <Skeleton className="w-24" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        <Skeleton className="w-40" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 truncate max-w-xs">
                                        <Skeleton className="w-32" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <Skeleton className="w-20" />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <Skeleton className="w-32" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-light-gray cursor-pointer ${
                                        selectedResearch?.researchID === item.researchID ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() => handleRowClick(item)} // Row click event
                                >
                                    <td className="px-4 py-4 text-center text-sm text-gray-900">
                                        {item.college}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-gray-900">
                                        {item.department}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate max-w-xs">
                                        <Link
                                            to={`/admin/arviewer?researchID=${encodeURIComponent(item.researchID)}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {item.author}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-gray-500">
                                        {item.researchARCID}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-gray-500">
                                        {item.pubDate}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CurrentResearchInventory;
