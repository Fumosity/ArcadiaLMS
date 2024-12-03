"use client"

import { useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export default function ARoomReservations() {
    const [dateRange, setDateRange] = useState({
        from: dayjs(),
        to: dayjs().add(2, 'day')
    })
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [sortBy, setSortBy] = useState("descending")
    const [filterRoom, setFilterRoom] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const entriesPerPage = 5

    const timeSlots = [
        "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM", "1:00PM"
    ]

    const rooms = [
        { id: "A701-A", name: "Discussion Room 1 (A701-A)" },
        { id: "A701-B", name: "Discussion Room 2 (A701-B)" }
    ]

    const reservations = [
        { room: "ARC-1", status: "Reserved", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "ARC-2", status: "Reserved", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "ARC-1", status: "Occupied", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "ARC-1", status: "Occupied", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "ARC-1", status: "Finished", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "ARC-1", status: "Finished", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
    ]

    const filteredReservations = reservations
        .filter(reservation => {
            const matchesSearch = searchQuery === "" ||
                Object.values(reservation).some(value =>
                    value.toLowerCase().includes(searchQuery.toLowerCase())
                )
            const matchesRoom = filterRoom === "" || reservation.room === filterRoom
            const matchesStatus = filterStatus === "" || reservation.status === filterStatus
            return matchesSearch && matchesRoom && matchesStatus
        })
        .sort((a, b) => {
            if (sortBy === "descending") {
                return b.date.localeCompare(a.date)
            }
            return a.date.localeCompare(b.date)
        })

    const totalPages = Math.ceil(filteredReservations.length / entriesPerPage)
    const startIndex = (currentPage - 1) * entriesPerPage
    const displayedReservations = filteredReservations.slice(startIndex, startIndex + entriesPerPage)

    const handlePrevious = () => {
        setDateRange(prev => ({
            from: prev.from.subtract(1, 'day'),
            to: prev.to.subtract(1, 'day')
        }))
    }

    const handleNext = () => {
        setDateRange(prev => ({
            from: prev.from.add(1, 'day'),
            to: prev.to.add(1, 'day')
        }))
    }

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen)
    }

    const handleDateChange = (newDate) => {
        setDateRange(prev => ({
            from: newDate,
            to: newDate.add(2, 'day')
        }))
        setIsCalendarOpen(false)
    }

    return (
        <div className="bg-white overflow-hidden border border-grey mb-8 p-6 rounded-lg w-full">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-arcadia-black">Room Reservations</h2>
                    <button className="border border-grey rounded-full px-2.5 py-0.5 text-grey hover:bg-blue-600 font-bold">
                        Go to Reservations
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-dark-gray">
                        {`${dateRange.from.format('MMMM D, YYYY')} – ${dateRange.to.format('MMMM D, YYYY')}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-light-gray rounded" onClick={toggleCalendar}>
                            <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-light-gray rounded" onClick={handlePrevious}>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-light-gray rounded" onClick={handleNext}>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border rounded-lg shadow-lg p-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar value={dateRange.from} onChange={handleDateChange} />
                        </LocalizationProvider>
                    </div>
                )}

                <div className="border rounded-lg">
                    <div className="grid grid-cols-[200px,1fr] border-b">
                        <div className="p-4 font-medium text-dark-gray">Space</div>
                        <div className="grid grid-cols-7 divide-x border-l">
                            {timeSlots.map((time) => (
                                <div key={time} className="p-4 text-center font-medium text-dark-gray">{time}</div>
                            ))}
                        </div>
                    </div>

                    <div className="border-b p-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-grey" defaultChecked />
                            <span className="font-medium text-arcadia-black">Discussion Rooms</span>
                        </div>
                    </div>

                    {rooms.map((room) => (
                        <div key={room.id} className="grid grid-cols-[200px,1fr] border-b last:border-b-0">
                            <div className="p-4 flex items-center gap-2">
                                <div className="w-6 h-6 bg-dark-blue rounded flex items-center justify-center text-white">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="text-dark-blue hover:underline cursor-pointer">{room.name}</span>
                            </div>
                            <div className="grid grid-cols-7 divide-x border-l">
                                {timeSlots.map((time) => (
                                    <div key={`${room.id}-${time}`} className="p-4 bg-light-gray"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green rounded"></div>
                        <span className="text-sm text-dark-gray">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-arcadia-yellow rounded"></div>
                        <span className="text-sm text-dark-gray">Your Reservation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-a-t-red rounded"></div>
                        <span className="text-sm text-dark-gray">Unavailable/Padding</span>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-by" className="text-sm text-gray-600">Sort By:</label>
                            <select
                                id="sort-by"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="filter-room" className="text-sm text-gray-600">Filter By:</label>
                            <select
                                id="filter-room"
                                value={filterRoom}
                                onChange={(e) => setFilterRoom(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="">All Rooms</option>
                                <option value="ARC-1">ARC-1</option>
                                <option value="ARC-2">ARC-2</option>
                            </select>
                            <select
                                id="filter-status"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="">All Status</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Finished">Finished</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search room, date, or borrower..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border rounded px-2 py-1 pl-8 w-64"
                        />
                        <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                <div className="mt-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Room</th>
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Status</th>
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Date</th>
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Period</th>
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Borrower</th>
                                <th className="text-left py-2 px-4 font-medium text-dark-gray">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedReservations.map((reservation, index) => (
                                <tr key={index} className="border-b last:border-b-0">
                                    <td className="py-2 px-4 bg-light-gray text-sm font-medium">{reservation.room}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${reservation.status === "Reserved"
                                                ? "bg-dark-yellow text-dark-gray"
                                                : reservation.status === "Occupied"
                                                    ? "bg-arcadia-red text-white"
                                                    : "bg-green text-dark-gray"
                                            }`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">{reservation.date}</td>
                                    <td className="py-2 px-4">{reservation.period}</td>
                                    <td className="py-2 px-4">{reservation.borrower}</td>
                                    <td className="py-2 px-4">{reservation.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center mt-4">
                    <div className="flex gap-2">
                        <button
                            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous Page
                        </button>
                        <span className="text-sm">Page {currentPage} of {totalPages}</span>
                        <button
                            className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next Page
                        </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredReservations.length)} of {filteredReservations.length} entries
                    </div>
                </div>

            </div>
        </div>
    )
}

