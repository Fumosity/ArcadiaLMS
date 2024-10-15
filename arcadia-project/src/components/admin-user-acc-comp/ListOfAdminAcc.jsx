import React, { useState } from "react";

const adminData = [
    {
        type: "Admin",
        email: "l.ejercito@example.com",
        name: "Layla Ejercito",
        userId: "123",
        schoolId: "2021-1-01000"
    },
    {
        type: "Admin",
        email: "j.smith@example.com",
        name: "John Smith",
        userId: "456",
        schoolId: "2020-2-02000"
    },
    {
        type: "Admin",
        email: "a.jones@example.com",
        name: "Alex Jones",
        userId: "789",
        schoolId: "2019-3-03000"
    },
    {
        type: "Admin",
        email: "k.thurman@example.com",
        name: "Keith Thurman",
        userId: "101",
        schoolId: "2018-4-04000"
    }
    // Add more admin records here as needed
];

const ListOfAdminAcc = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("Ascending");
    const [typeFilter, setTypeFilter] = useState("All");

    const totalPages = Math.ceil(adminData.length / entriesPerPage);

    // Handle sorting
    const sortedData = [...adminData].sort((a, b) => {
        if (sortOrder === "Ascending") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    // Handle filtering by admin type
    const filteredData = sortedData.filter((admin) =>
        (typeFilter === "All" || admin.type === typeFilter) &&
        (admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.schoolId.includes(searchTerm))
    );

    // Pagination logic
    const startIndex = (currentPage - 1) * entriesPerPage;
    const displayedAdmins = filteredData.slice(startIndex, startIndex + entriesPerPage);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">List of Admin Accounts</h2>
                
                {/* Controls for sort, filter, and search */}
                <div className="mb-4 flex flex-wrap items-center space-x-4">
                    {/* Sort By */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Sort By:</span>
                        <button
                            onClick={() =>
                                setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")
                            }
                            className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
                        >
                            {sortOrder}
                        </button>
                    </div>

                    {/* Filter By */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Filter By:</span>
                        <select
                            className="bg-gray-200 py-1 px-3 border rounded-full text-xs"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="search" className="text-sm">Search:</label>
                        <input
                            type="text"
                            id="search"
                            className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                            placeholder="Name, email, or ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Name</th>
                            <th className="text-left py-2">User ID</th>
                            <th className="text-left py-2">School ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedAdmins.map((admin, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-2">
                                    <span className="px-2 py-1 bg-yellow-200 rounded-full text-xs">
                                        {admin.type}
                                    </span>
                                </td>
                                <td className="py-2">{admin.email}</td>
                                <td className="py-2">{admin.name}</td>
                                <td className="py-2">{admin.userId}</td>
                                <td className="py-2">{admin.schoolId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                        className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                    <button
                        className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListOfAdminAcc;
