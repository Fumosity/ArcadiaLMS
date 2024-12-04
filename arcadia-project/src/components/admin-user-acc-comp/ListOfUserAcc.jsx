import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js"; // Adjust the import path as necessary.

const ListOfUserAcc = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("Ascending");
    const [typeFilter, setTypeFilter] = useState("All");
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAccounts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("user_accounts")
                .select("userAccountType, userEmail, userFName, userLName, userID, userLPUID, userCollege, userDepartment")
                .in("userAccountType", ["User", "Teacher", "Student", "Intern"]); // Use .in() to filter multiple types

            if (error) {
                console.error("Error fetching data from Supabase:", error);
            } else {
                const formattedData = data.map((user) => ({
                    type: user.userAccountType,
                    email: user.userEmail,
                    name: `${user.userFName} ${user.userLName}`,
                    userId: user.userID,
                    schoolId: user.userLPUID,
                    college: user.userCollege,
                    department: user.userDepartment,
                }));
                setUserData(formattedData);
            }
            setLoading(false);
        };

        fetchUserAccounts();
    }, []);

    const totalPages = Math.ceil(userData.length / entriesPerPage);

    // Handle sorting
    const sortedData = [...userData].sort((a, b) => {
        if (sortOrder === "Ascending") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    // Handle filtering and searching
    const filteredData = sortedData.filter((user) => {
        const matchesType =
            typeFilter === "All" || user.type === typeFilter;

        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.schoolId.includes(searchTerm);

        return matchesType && matchesSearch;
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * entriesPerPage;
    const displayedUsers = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleUserClick = (user) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: user.userId },
        });
    };
    

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">List of User Accounts</h2>

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
                            <option value="User">User</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Intern">Intern</option>
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
                <table className="w-full table-auto divide-y-2">
                    <thead>
                        <tr>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Name</th>
                            <th className="text-left py-2">User ID</th>
                            <th className="text-left py-2">School ID</th>
                            <th className="text-left py-2">College</th>
                            <th className="text-left py-2">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-2">
                                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                                        {user.type}
                                    </span>
                                </td>
                                <td className="py-2">{user.email}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleUserClick(user)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {user.name}
                                    </button>
                                </td>
                                <td className="py-2">{user.userId}</td>
                                <td className="py-2">{user.schoolId}</td>
                                <td className="py-2">{user.college}</td>
                                <td className="py-2">{user.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                        className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                    <button
                        className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListOfUserAcc;

