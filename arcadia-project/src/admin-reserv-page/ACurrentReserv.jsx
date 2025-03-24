import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

const periods = [
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
]
const rooms = ["A701-A", "A701-B", "A701-C", "A701-D"]
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function ACurrentReserv() {
  // Create a date object for the current date in the user's local timezone
  const today = new Date()
  // Ensure we're working with the current date by setting to midnight in local timezone
  today.setHours(0, 0, 0, 0)

  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(() => {
    // Format today's date as YYYY-MM-DD in local timezone
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  })
  const [reservations, setReservations] = useState({})

  useEffect(() => {
    async function fetchReservations() {
      const { data, error } = await supabase.from("reservation").select("reservationData")

      if (error) {
        console.error("Error fetching reservations:", error)
        return
      }

      const availability = {}
      periods.forEach((period) => {
        availability[period] = {}
        rooms.forEach((room) => {
          availability[period][room] = "Available"
        })
      })

      data.forEach(({ reservationData }) => {
        const { date, room, startTime, endTime } = reservationData

        // Fix timezone handling to ensure correct date comparison
        const reservationDate = new Date(date)
        const formattedDate = reservationDate.toISOString().split("T")[0]

        if (formattedDate === selectedDate) {
          periods.forEach((period) => {
            const [startHour] = period.split(":")
            const periodStartTime = Number.parseInt(startHour, 10)
            const startHourInt = Number.parseInt(startTime.split(":")[0], 10)
            const endHourInt = Number.parseInt(endTime.split(":")[0], 10)

            if (periodStartTime >= startHourInt && periodStartTime < endHourInt) {
              availability[period][room] = "Reserved"
            }
          })
        }
      })

      setReservations(availability)
    }

    fetchReservations()
  }, [selectedDate])

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentYear, currentMonth, i))
  }

  // Format the selected date for display
  const selectedDateObj = new Date(selectedDate + "T00:00:00")
  const formattedSelectedDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="uHero-cont max-w-[1500px] w-full p-6 bg-white rounded-lg border border-grey">
      <h2 className="text-2xl font-semibold mb-6">Room Reservations</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 border border-grey">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h3 className="text-lg font-medium">
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) {
                return <div key={i} className="h-10 w-full opacity-0 cursor-default"></div>
              }

              // Create a date string in YYYY-MM-DD format for comparison
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, "0")
              const day = String(date.getDate()).padStart(2, "0")
              const dateString = `${year}-${month}-${day}`
            
              const isPast = date < today
              const isSunday = date.getDay() === 0
              const isToday = date.getTime() === today.getTime()
              const isSelected = dateString === selectedDate

              // Build class string conditionally
              let dayClasses =
                "h-10 w-full flex items-center justify-center rounded-md text-sm transition-all duration-200"

              if (isToday) {
                dayClasses += " bg-arcadia-red text-white" // Always highlight today
              } else if (isSelected) {
                dayClasses += " bg-ongoing text-white" // Highlight selected future dates
              } else {
                dayClasses += " hover:bg-gray-100" // Default hover effect
              }

              if (isPast || isSunday) {
                dayClasses += " text-grey cursor-not-allowed" // Disable past dates and Sundays
              } else {
                dayClasses += " cursor-pointer" // Enable clickable dates
              }

              return (
                <div
                  key={i}
                  className={dayClasses}
                  onClick={() => !(isPast || isSunday) && setSelectedDate(dateString)}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reservation Table */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg border border-grey overflow-hidden p-2">
            <div className="text-md font-medium text-gray-700 p-3 bg-gray-50 border-b">
              Availability for {formattedSelectedDate}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-t-0 border-grey">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left font-medium text-gray-700 border-b border-r">Period</th>
                    {rooms.map((room) => (
                      <th
                        key={room}
                        className="py-2 px-3 text-center font-medium text-gray-700 border-b border-r last:border-r-0"
                      >
                        {room}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, idx) => {
                    const isLastRow = idx === periods.length - 1

                    return (
                      <tr key={period} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className={`py-2 px-3 border-r font-medium ${isLastRow ? "" : "border-b"}`}>{period}</td>

                        {rooms.map((room, roomIdx) => {
                          const isReserved = reservations[period]?.[room] === "Reserved"
                          const cellClasses = `
                            py-2 px-3 text-center font-semibold 
                            border-grey border-r
                            ${isLastRow ? "" : "border-b"}
                            ${roomIdx === rooms.length - 1 ? "border-r-0" : ""}
                            ${isReserved ? "bg-intended text-white" : "bg-resolved text-white"}
                          `

                          return (
                            <td key={room} className={cellClasses.trim()}>
                              {reservations[period]?.[room] || "Available"}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

