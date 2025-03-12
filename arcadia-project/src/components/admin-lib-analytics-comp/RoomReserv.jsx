import { useState, useEffect, useMemo} from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "../../supabaseClient";

const RoomReserv = () => {
    const [timeFrame, setTimeFrame] = useState("month");
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sortOrder, setSortOrder] = useState("Ascending");
    const [roomFilter, setRoomFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);

        // Filter, Sort, and Search Logic
        const filteredReservations = useMemo(() => {
            let filtered = [...reservations];
    
            // Filtering by Room
            if (roomFilter !== "All") {
                filtered = filtered.filter(res => res.room === roomFilter);
            }
    
            // Searching (Matches Room, Borrower, or Purpose)
            if (searchTerm.trim() !== "") {
                filtered = filtered.filter(res => 
                    res.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    res.purpose.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
    
            // Sorting by Date
            filtered.sort((a, b) => {
                return sortOrder === "Ascending"
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            });
    
            return filtered;
        }, [reservations, sortOrder, roomFilter, searchTerm]);
    
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("reservation")
                    .select("reservationData, user_accounts(userFName, userLName)");

                if (error) {
                    console.error("Error fetching reservations:", error.message);
                } else {
                    const formattedData = data.map((item) => ({
                        date: item.reservationData.date,
                        room: item.reservationData.room,
                        purpose: item.reservationData.title,
                        period: `${item.reservationData.startTime} - ${item.reservationData.endTime}`,
                        name: item.user_accounts
                            ? `${item.user_accounts.userFName} ${item.user_accounts.userLName}`
                            : "N/A",
                    }));

                    setReservations(formattedData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error: ", error);
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    // Process data for the chart
    const chartData = reservations.reduce((acc, res) => {
        const existingEntry = acc.find((entry) => entry.date === res.date);
        if (existingEntry) {
            existingEntry.count += 1;
        } else {
            acc.push({ date: res.date, count: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <h3 className="text-2xl font-semibold mb-4">Room Reservation Data</h3>

            {/* Time Frame Selector */}
            <div className="mb-4">
                <label htmlFor="time-frame" className="mr-2">Select Time Frame:</label>
                <select
                    id="time-frame"
                    onChange={(e) => setTimeFrame(e.target.value)}
                    value={timeFrame}
                    className="border border-gray-300 rounded-md py-1 px-2"
                >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                </select>
            </div>

            {/* Bar Chart for Room Reservations */}
            <div className="w-full mb-6">
                <ResponsiveContainer width="100%" aspect={3}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#FFB200" name="Reservations" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table of Reservations */}
            <div>
            {/* Controls for sort, filter, and search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Sort:</span>
                        <button
                            onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
                            className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
                        >
                            {sortOrder}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Room:</span>
                        <select
                            className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
                            value={roomFilter}
                            onChange={(e) => setRoomFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            {[...new Set(reservations.map(res => res.room))].map((room, idx) => (
                                <option key={idx} value={room}>{room}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Entries:</span>
                        <select
                            className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-20"
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center space-x-2 min-w-[0]">
                    <label htmlFor="search" className="font-medium text-sm">Search:</label>
                    <input
                        type="text"
                        id="search"
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
                        placeholder="Room, borrower, or purpose"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Room</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Period</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Borrower</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Purpose</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center">Loading data...</td>
                            </tr>
                        ) : filteredReservations.length > 0 ? (
                            filteredReservations.slice(0, entriesPerPage).map((res, index) => (
                                <tr key={index} className="hover:bg-light-gray">
                                    <td className="px-4 py-3 text-sm text-center">{res.room}</td>
                                    <td className="px-4 py-3 text-sm text-center">{res.date}</td>
                                    <td className="px-4 py-3 text-sm text-center">{res.period}</td>
                                    <td className="px-4 py-3 text-sm text-center">{res.name}</td>
                                    <td className="px-4 py-3 text-sm text-center">{res.purpose}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center text-zinc-600">No data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default RoomReserv;
