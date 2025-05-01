"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient"

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
const rooms = ["Discussion Room", "Law Discussion Room"]
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CurrentReservations() {
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
  const [holidays, setHolidays] = useState([])

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/PH`)
        if (!response.ok) {
          throw new Error("Failed to fetch holidays")
        }
        const data = await response.json()
        // Store holiday dates in YYYY-MM-DD format
        const holidayDates = data.map((holiday) => holiday.date)
        setHolidays(holidayDates)
      } catch (error) {
        console.error("Error fetching holidays:", error)
      }
    }

    fetchHolidays()
  }, [currentYear])

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

      // Check if selected date is a holiday
      const isSelectedDateHoliday = holidays.includes(selectedDate)

      // If it's a holiday, mark all slots as reserved
      if (isSelectedDateHoliday) {
        periods.forEach((period) => {
          rooms.forEach((room) => {
            availability[period][room] = "Reserved"
          })
        })
      } else {
        // Process normal reservations
        data.forEach(({ reservationData }) => {
          const { date, room, startTime, endTime } = reservationData

          // Fix timezone handling to ensure correct date comparison
          const reservationDate = new Date(date)
          const formattedDate = reservationDate.toISOString().split("T")[0]

          if (formattedDate === selectedDate) {
            // Properly parse 12-hour time format to 24-hour
            const parse12HourTime = (time12) => {
              if (!time12) return { hours: 0, minutes: 0 }

              // Check if time is already in 24-hour format
              if (time12.match(/^\d{1,2}:\d{2}$/)) {
                const [hours, minutes] = time12.split(":").map((num) => Number.parseInt(num, 10))
                return { hours, minutes }
              }

              // Parse 12-hour format (HH:MM AM/PM)
              const match = time12.match(/(\d+):(\d+)\s*(AM|PM|am|pm)/i)
              if (!match) return { hours: 0, minutes: 0 }

              let [_, hours, minutes, period] = match
              hours = Number.parseInt(hours, 10)

              if (period.toLowerCase() === "pm" && hours < 12) {
                hours += 12
              } else if (period.toLowerCase() === "am" && hours === 12) {
                hours = 0
              }

              return { hours, minutes: Number.parseInt(minutes, 10) }
            }

            // Parse reservation times
            const reservationStart = parse12HourTime(startTime)
            const reservationEnd = parse12HourTime(endTime)

            // Convert to decimal for easier comparison
            const reservationStartDecimal = reservationStart.hours + reservationStart.minutes / 60
            const reservationEndDecimal = reservationEnd.hours + reservationEnd.minutes / 60

            periods.forEach((period) => {
              // Parse period times (format: "HH:00 - HH:00")
              const [periodStart, periodEnd] = period.split(" - ")

              // Handle the special case for afternoon hours (12:00 - 01:00, etc.)
              const parsePeriodTime = (timeStr) => {
                const [hourStr] = timeStr.split(":")
                let hour = Number.parseInt(hourStr, 10)

                // Convert 12-hour format to 24-hour
                // For periods after 12:00, we need to add 12 to get PM hours
                if (hour < 7 && periods.indexOf(period) >= 6) {
                  // If hour is 1-6 and it's in the afternoon periods
                  hour += 12
                }

                return hour
              }

              const periodStartHour = parsePeriodTime(periodStart)
              const periodEndHour = parsePeriodTime(periodEnd)

              // Check if this period overlaps with the reservation
              if (
                (periodStartHour >= reservationStartDecimal && periodStartHour < reservationEndDecimal) ||
                (periodEndHour > reservationStartDecimal && periodEndHour <= reservationEndDecimal) ||
                (periodStartHour <= reservationStartDecimal && periodEndHour >= reservationEndDecimal)
              ) {
                availability[period][room] = "Reserved"
              }
            })
          }
        })
      }

      setReservations(availability)
    }

    fetchReservations()
  }, [selectedDate, holidays])

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
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <h2 className="text-2xl font-semibold mb-6">Room Reservations</h2>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Calendar Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 border border-grey">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray transition-colors"
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
                className="text-gray"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h3 className="text-lg font-medium">
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray transition-colors"
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
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray">
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

              // Check if the date is a holiday
              const isHoliday = holidays.includes(dateString)

              // Build class string conditionally
              let dayClasses =
                "h-10 w-full flex items-center justify-center rounded-md text-sm transition-all duration-200 relative"

              if (isToday) {
                dayClasses += " bg-arcadia-red text-white" // Always highlight today
              } else if (isSelected) {
                dayClasses += " bg-ongoing text-white" // Highlight selected future dates
              } else {
                dayClasses += " hover:bg-gray" // Default hover effect
              }

              if ((isPast && !isToday) || isSunday || isHoliday) {
                dayClasses += " text-grey cursor-not-allowed bg-gray" // Disable past dates (except today), Sundays, and holidays
              } else {
                dayClasses += " cursor-pointer" // Enable clickable dates
              }

              return (
                <div
                  key={i}
                  className={dayClasses}
                  onClick={() => {
                    // Allow clicking today's date even after selecting other dates
                    if (isToday || !(isPast || isSunday || isHoliday)) {
                      setSelectedDate(dateString)
                    }
                  }}
                >
                  {date.getDate()}
                  {isHoliday && !isToday && !isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-300 rounded-b-md"></div>
                  )}
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
