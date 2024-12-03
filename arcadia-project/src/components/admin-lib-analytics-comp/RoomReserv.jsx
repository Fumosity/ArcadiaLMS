import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jun 2023', Quarterly: 30, Annual: 2 },
    { name: 'Sep 2023', Quarterly: 32, Annual: 0 },
    { name: 'Dec 2023', Quarterly: 34, Annual: 1 },
    { name: 'Mar 2024', Quarterly: 36, Annual: 3 },
    { name: 'Jun 2024', Quarterly: 32, Annual: 1 },
];

const reservations = [
    { room: 'ARC-1', status: 'Reserved', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
    { room: 'ARC-2', status: 'Reserved', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
    { room: 'ARC-3', status: 'Cancelled', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
    { room: 'ARC-4', status: 'Cancelled', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
    { room: 'ARC-5', status: 'Finished', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
    { room: 'ARC-6', status: 'Finished', date: 'August 23', time: '10:00AM - 12:00PM', borrower: 'Henry Avery', purpose: 'CS101 Group Study' },
];

export default function RoomReserv() {
    const [activeTab, setActiveTab] = useState('Quarterly');
    const [sortOrder, setSortOrder] = useState("Descending");
    const [typeFilter, setTypeFilter] = useState("Type");
    const [typeOrder, setTypeOrder] = useState("Borrow");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entries, setEntries] = useState(5);

    const indexOfLastItem = currentPage * entries;
    const indexOfFirstItem = indexOfLastItem - entries;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservations.length / entries);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold ">Room Reservations</h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Go to Reservations
                </button>
            </div>

            <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'Quarterly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('Quarterly')}
                    >
                        Quarterly
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'Annual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('Annual')}
                    >
                        Annual
                    </button>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={activeTab} fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center mb-6 space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        onClick={() => setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")}
                        className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {sortOrder}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Filter By:</span>
                    <span
                        className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {typeOrder}
                    </span>
                    <span
                        className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs"
                        style={{ borderRadius: "40px" }}
                    >
                        {typeFilter}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="search" className="text-sm">Search:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                        style={{ borderRadius: "40px" }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Room, date, or borrower"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 rounded-t-lg" style={{ borderRadius: "40px" }}>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.room}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.status === 'Reserved' ? 'bg-green-100 text-green-800' :
                                            item.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.borrower}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.purpose}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="flex justify-center items-center space-x-4">
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    style={{ borderRadius: "40px" }}
                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    className={`bg-gray-200 py-1 px-3 rounded-full text-xs ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                    style={{ borderRadius: "40px" }}
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}