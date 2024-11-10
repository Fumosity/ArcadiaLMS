"use client"

import { useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export default function Component() {
  const [dateRange, setDateRange] = useState({
    from: dayjs(),
    to: dayjs().add(2, 'day')
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const timeSlots = [
    "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM", "1:00PM"
  ]

  const rooms = [
    { id: "A701-A", name: "Discussion Room 1 (A701-A)" },
    { id: "A701-B", name: "Discussion Room 2 (A701-B)" }
  ]

  const reservations = [
    { room: "ARC-1", status: "Reserved", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
    { room: "ARC-1", status: "Finished", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
    { room: "ARC-1", status: "Finished", date: "August 23", period: "11:00AM - 12:00PM", borrower: "Henry Avery", purpose: "CS101 Group Study" },
  ]

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
    <div className="uMain-cont p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-arcadia-black">Current Reservations</h2>
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
              {reservations.map((reservation, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2 px-4 bg-light-gray font-medium">{reservation.room}</td>
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      reservation.status === "Reserved" 
                        ? "bg-dark-yellow text-dark-gray" 
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
      </div>
    </div>
  )
}