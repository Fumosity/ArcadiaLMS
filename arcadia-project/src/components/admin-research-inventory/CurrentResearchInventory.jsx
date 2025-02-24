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

    const formatAuthor = (authors) => {
        if (!authors || authors.length === 0) return "N/A";

        if (!Array.isArray(authors)) {
            authors = [authors]; // Handle cases where author is not an array
        }

        const formattedAuthors = authors.map(author => {
            author = author.trim();
            const names = author.split(" ");
            const initials = names.slice(0, -1).map(name => name[0] + ".");
            const lastName = names.slice(-1)[0];
            return `${initials.join("")} ${lastName}`;
        });

        if (formattedAuthors.length <= 2) {
            return formattedAuthors.join(", ");
        } else {
            const etAlCount = authors.length - 2;
            return `${formattedAuthors[0]}, ${formattedAuthors[1]}, et al (${etAlCount} more)`;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <h3 className="text-xl font-semibold mb-4">Current Research Inventory</h3>

            <div className="flex flex-wrap items-center mb-4 space-x-4">
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

            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["College", "Department", "Title", "Authors", "Thesis ID", "Pub. Date"].map(
                                (header) => (
                                    <th
                                        key={header}
                                        className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                    className={`hover:bg-light-gray cursor-pointer ${selectedResearch?.researchID === item.researchID ? "bg-gray-200" : ""
                                        }`}
                                    onClick={() => handleRowClick(item)} // Row click event
                                >
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-36">
                                        <div className="flex justify-center">
                                            <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                                                {item.college}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-sm max-w-36">
                                        <div className="flex justify-center">
                                            <span className="bookinv-genre inline-flex items-center justify-center text-sm font-medium rounded-full border-gray px-2 py-1">
                                                {item.department}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate max-w-64">
                                        <Link
                                            to={`/admin/arviewer?researchID=${encodeURIComponent(item.researchID)}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                    </td>

                                    <td className="px-4 py-4 text-sm truncate max-w-48 relative group"> {/* Added group class here */}
                                        <div className="flex items-center space-x-1">
                                            <span className="inline-block truncate break-words">{formatAuthor(item.author)}</span>
                                            {Array.isArray(item.author) && item.author.length > 2 && ( // Check if item.author is an array before checking length
                                                <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded p-2 z-10 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                                    {item.author.slice(2).map((author, i) => ( // Use item.author here!
                                                        <div key={i} className="mt-1">
                                                            {formatAuthor([author])}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-center text-sm text-gray-500 w-10">
                                        {item.researchARCID}
                                    </td>

                                    <td className="px-4 py-4 text-center text-sm text-gray-500 min-w-8">
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
