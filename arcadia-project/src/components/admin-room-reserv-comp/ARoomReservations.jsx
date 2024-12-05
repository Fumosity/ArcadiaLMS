"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import { scheduler } from 'dhtmlx-scheduler';  // Import scheduler directly

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
        "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM", 
        "1:00PM", "2:00PM", "3:00PM", "4:00PM", "5:00PM"
    ]

    const rooms = [
        { id: "A701-A", name: "Discussion Room 1 (A701-A)" },
        { id: "A701-B", name: "Discussion Room 2 (A701-B)" }
    ]

    const reservations = [
        { room: "A701-A", status: "Reserved", date: "2024-12-10", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
        { room: "A701-B", status: "Reserved", date: "2024-12-10", period: "11:00AM - 12:00PM", borrower: "John Doe", purpose: "Math Study" },
        // more reservation data...
    ]

    const schedulerContainer = useRef(null);

    // Filter reservations based on search, room, and status
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

    useEffect(() => {
        // Initialize DHTMLX Scheduler after component mounts
        if (schedulerContainer.current) {
            scheduler.init(schedulerContainer.current, new Date(), "week");

            // Add reservations to the scheduler as events
            const events = reservations.map((reservation) => ({
                id: `${reservation.room}-${reservation.date}-${reservation.period}`,
                text: `${reservation.borrower}: ${reservation.purpose}`,
                start_date: new Date(reservation.date + ' ' + reservation.period.split(' - ')[0]),
                end_date: new Date(reservation.date + ' ' + reservation.period.split(' - ')[1]),
                room: reservation.room,
                status: reservation.status
            }));

            scheduler.parse(events, "json");
        }
    }, [reservations]);

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

                {/* DHTMLX Scheduler */}
                <div ref={schedulerContainer} className="dhtmlx-scheduler-container" style={{ height: '500px' }}></div>

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
                                <option value="Available">Available</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="px-3 py-2 rounded-md border"
                        />
                        <button className="p-2 border-2 border-gray-300 rounded ml-2">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left">
                                <th>Room</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Borrower</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((reservation, index) => (
                                <tr key={index} className="border-t">
                                    <td>{reservation.room}</td>
                                    <td>{reservation.status}</td>
                                    <td>{reservation.date}</td>
                                    <td>{reservation.period}</td>
                                    <td>{reservation.borrower}</td>
                                    <td>{reservation.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
