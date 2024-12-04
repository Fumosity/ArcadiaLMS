import React, { useEffect, useState } from 'react';
import { supabase } from "/src/supabaseClient.js";

const finesData = [
    {
        reason: 'Overdue',
        totalFine: 200.0,
        addPerDay: 20.0,
        noBorrowed: 2,
        name: 'Samuel Alcantara',
        userId: '123',
        schoolId: '2021-2-01000',
    },
    {
        reason: 'Overdue',
        totalFine: 500.0,
        addPerDay: 0.0,
        noBorrowed: 0,
        name: 'Maria Cruz',
        userId: '456',
        schoolId: '2020-3-02000',
    },
    {
        reason: 'Damage',
        totalFine: 300.0,
        addPerDay: 10.0,
        noBorrowed: 1,
        name: 'John Doe',
        userId: '789',
        schoolId: '2019-4-03000',
    },
    {
        reason: 'Overdue',
        totalFine: 150.0,
        addPerDay: 15.0,
        noBorrowed: 1,
        name: 'Jane Smith',
        userId: '101',
        schoolId: '2018-5-04000',
    },
];

function OutstandingFines() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const totalPages = Math.ceil(finesData.length / entriesPerPage);

    const [sortOrder, setSortOrder] = useState('Descending');
    const [sortBy, setSortBy] = useState('totalFine'); // Default sort by 'totalFine'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transactionID, userID, bookID, deadline');
    
                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    const formattedData = data.map(item => {
                    
                        return {
                            transaction_id: item.transactionID,
                            user_id: item.userID,
                            book_id: item.bookID,
                            deadline: item.deadline,
                        };
                    });
    
                    setBkhistoryData(formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };
    
        fetchData();
    }, []);
    
    // Handle sorting logic
    const sortedData = [...finesData].sort((a, b) => {
        if (sortOrder === 'Descending') {
            return b[sortBy] > a[sortBy] ? 1 : -1;
        } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        }
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * entriesPerPage;
    const displayedData = sortedData.slice(startIndex, startIndex + entriesPerPage);

    return (
        <div className="aMain-cont">
            <h2 className="text-xl font-semibold mb-4">Accounts With Outstanding Fines</h2>
            <p className="text-sm text-gray-600 mb-4">
                Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
            </p>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded"
                        onClick={() =>
                            setSortOrder(sortOrder === 'Descending' ? 'Ascending' : 'Descending')
                        }
                    >
                        {sortOrder}
                    </button>
                    <span className="font-medium text-sm">Filter:</span>
                    <select
                        className="px-3 py-1 bg-gray-200 rounded"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="totalFine">Total Fine</option>
                        <option value="addPerDay">Add Per Day</option>
                        <option value="name">Name</option>
                        <option value="reason">Reason</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Search:</span>
                    <input
                        type="text"
                        placeholder="A name or ID"
                        className="contSearchbar"
                    />
                    <button className="genRedBtns">Print a Report</button>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Reason
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Total Fine
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Add Per Day
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            No. Borrowed
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            User ID
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                            School ID
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {displayedData.map((fine, index) => (
                        <tr key={index} className="whitespace-nowrap">
                            <td className="px-4 py-2 text-center">
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                    {fine.reason}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-center">₱{fine.totalFine.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">₱{fine.addPerDay.toFixed(2)}/d</td>
                            <td className="px-4 py-2 text-center">
                                <span>{fine.noBorrowed}</span>
                                <button className="viewBtn ml-2 px-2 py-1 text-xs bg-gray-200 rounded">
                                    View
                                </button>
                            </td>
                            <td className="px-4 py-2 text-center">{fine.name}</td>
                            <td className="px-4 py-2 text-center">{fine.userId}</td>
                            <td className="px-4 py-2 text-center">{fine.schoolId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`uPage-btn ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red hover:font-semibold'
                        }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`uPage-btn ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red'
                        }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}

export default OutstandingFines;
