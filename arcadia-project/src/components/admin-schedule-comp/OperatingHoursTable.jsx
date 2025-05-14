import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"

export default function OperatingHoursTable() {
  const [hours, setHours] = useState([])
  const [holidayHours, setHolidayHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHolidays, setShowHolidays] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch regular hours
        const { data: regularData, error: regularError } = await supabase
          .from("operating_hours")
          .select("*")
          .order("dayOrder")

        if (regularError) throw regularError

        // Fetch holiday hours
        const { data: holidayData, error: holidayError } = await supabase
          .from("holiday_hours")
          .select("*")
          .order("date")

        if (holidayError) throw holidayError

        setHours(regularData || [])
        setHolidayHours(holidayData || [])
      } catch (error) {
        console.error("Error fetching hours:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function formatTime(time) {
    if (!time) return null

    // Convert from 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    return `${hour12}:${minutes} ${ampm}`
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full overflow-auto">
        <h3 className="text-lg font-medium mb-3">Regular Hours</h3>
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b [&_tr]:border-grey">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Day</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Hours</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {hours.map((hour) => (
              <tr key={hour.id} className="border-b border-grey transition-colors hover:bg-gray-50">
                <td className="p-2 align-middle font-medium">{hour.day}</td>
                <td className={`p-2 align-middle text-right ${hour.isClosed ? "text-red-600" : "text-gray-800"}`}>
                  {hour.isClosed ? (
                    "Closed"
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>
                        {formatTime(hour.opensAt)} - {formatTime(hour.closesAt)}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {holidayHours.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Holiday Hours</h3>
            <button
              type="button"
              onClick={() => setShowHolidays(!showHolidays)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showHolidays ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showHolidays && (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Holiday</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Date</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Hours</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {holidayHours.map((holiday) => (
                    <tr key={holiday.id} className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 align-middle font-medium">{holiday.holiday_name}</td>
                      <td className="p-4 align-middle">{formatDate(holiday.date)}</td>
                      <td className={`p-4 align-middle text-right ${holiday.isClosed ? "text-red-600" : "text-gray-800"}`}>
                        {holiday.isClosed ? (
                          "Closed"
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3.5 w-3.5"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>
                              {formatTime(holiday.opensAt)} - {formatTime(holiday.closesAt)}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}