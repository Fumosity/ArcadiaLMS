import { useState, useEffect, useMemo, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"

const RoomReserv = () => {
  const [timeFrame, setTimeFrame] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const [sortOrder, setSortOrder] = useState("Ascending")
  const [roomFilter, setRoomFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const handleReservationClick = (reservation) => {
    navigate("/reservation-details", {
      state: { reservation: reservation },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleUserClick = (reservation) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: reservation.user_accounts.userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "Invalid Time"
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return "Invalid Time"
    }
  }

  const formatPeriod = (periodString) => {
    if (!periodString) return "Invalid Period"

    const [startTime, endTime] = periodString.split(" - ")
    if (!startTime || !endTime) return periodString

    try {
      const formattedStart = formatTime(startTime)
      const formattedEnd = formatTime(endTime)
      return `${formattedStart} - ${formattedEnd}`
    } catch (error) {
      return periodString
    }
  }

  // Filter, Sort, and Search Logic
  const filteredReservations = useMemo(() => {
    let filtered = [...reservations]

    // Filtering by Room
    if (roomFilter !== "All") {
      filtered = filtered.filter((res) => res.room === roomFilter)
    }

    // Searching (Matches Room, Borrower, or Purpose)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (res) =>
          res.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (res.user_accounts?.userAccountType || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sorting by Date
    filtered.sort((a, b) => {
      return sortOrder === "Ascending" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    })

    return filtered
  }, [reservations, sortOrder, roomFilter, searchTerm])

  // Calculate total pages
  const totalPages = Math.ceil(filteredReservations.length / entriesPerPage)

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedReservations = filteredReservations.slice(startIndex, startIndex + entriesPerPage)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("reservation")
          .select("reservationData, user_accounts(userFName, userLName, userID, userAccountType)")

        if (error) {
          console.error("Error fetching reservations:", error.message)
        } else {
          const formattedData = data.map((item) => ({
            date: item.reservationData.date
              ? new Date(item.reservationData.date).toISOString().split("T")[0]
              : "Invalid Date",
            room: item.reservationData.room || "Unknown Room",
            purpose: item.reservationData.title || "No Purpose",
            period:
              item.reservationData.startTime && item.reservationData.endTime
                ? `${item.reservationData.startTime} - ${item.reservationData.endTime}`
                : "Invalid Time",
            name: item.user_accounts ? `${item.user_accounts.userFName} ${item.user_accounts.userLName}` : "N/A",
            user_accounts: item.user_accounts,
          }))

          setReservations(formattedData)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error: ", error)
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const filterDataByTimeFrame = useCallback(() => {
    const date = new Date(currentDate)
    const filtered = [...reservations]

    if (timeFrame === "day") {
      return filtered.filter((res) => {
        const resDate = new Date(res.date)
        return resDate.toDateString() === date.toDateString()
      })
    } else if (timeFrame === "week") {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      return filtered.filter((res) => {
        const resDate = new Date(res.date)
        return resDate >= weekStart && resDate <= weekEnd
      })
    } else if (timeFrame === "month") {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      monthEnd.setHours(23, 59, 59, 999)

      return filtered.filter((res) => {
        const resDate = new Date(res.date)
        return resDate >= monthStart && resDate <= monthEnd
      })
    } else if (timeFrame === "year") {
      const yearStart = new Date(date.getFullYear(), 0, 1)
      const yearEnd = new Date(date.getFullYear(), 11, 31)
      yearEnd.setHours(23, 59, 59, 999)

      return filtered.filter((res) => {
        const resDate = new Date(res.date)
        return resDate >= yearStart && resDate <= yearEnd
      })
    }
    return filtered
  }, [reservations, timeFrame, currentDate])

  // Process data for the chart
  const chartData = useMemo(() => {
    const filteredByTime = filterDataByTimeFrame()

    // Group reservations by date and room
    const dataByDate = filteredByTime.reduce((acc, res) => {
      const date = res.date
      if (!acc[date]) {
        acc[date] = {
          date,
          "Discussion Room": 0,
          "Law Discussion Room": 0,
        }
      }

      // Increment the count for the specific room
      if (res.room === "Discussion Room") {
        acc[date]["Discussion Room"] += 1
      } else if (res.room === "Law Discussion Room") {
        acc[date]["Law Discussion Room"] += 1
      }

      return acc
    }, {})

    // Convert to array for the chart
    const chartArray = Object.values(dataByDate)

    // Sort by date in ascending order
    chartArray.sort((a, b) => new Date(a.date) - new Date(b.date))

    return chartArray
  }, [filterDataByTimeFrame])

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (timeFrame === "year") {
      newDate.setFullYear(newDate.getFullYear() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (timeFrame === "year") {
      newDate.setFullYear(newDate.getFullYear() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatDateRange = () => {
    if (timeFrame === "day") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } else if (timeFrame === "week") {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
    } else if (timeFrame === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (timeFrame === "year") {
      return currentDate.getFullYear().toString()
    }
    return ""
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Room Reservation Data</h3>

      {/* Time Frame Selector with Date Navigation */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <select
          id="time-frame"
          onChange={(e) => {
            setTimeFrame(e.target.value)
            // The chartData will automatically update due to the dependency in useMemo
          }}
          value={timeFrame}
          className="bg-white p-2 border border-grey rounded-md"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        <div className="flex justify-center items-center gap-2 border border-grey rounded">
          <button onClick={navigatePrevious} className="p-2 hover:bg-grey">
            &lt;
          </button>
          <span className="font-medium">{formatDateRange()}</span>
          <button onClick={navigateNext} className="p-2 hover:bg-grey">
            &gt;
          </button>
        </div>
      </div>

      {/* Stacked Bar Chart for Room Reservations */}
      <div className="w-full mb-6">
        <ResponsiveContainer width="100%" aspect={3}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Discussion Room" stackId="a" fill="#FFB200" name="Discussion Room" />
            <Bar dataKey="Law Discussion Room" stackId="a" fill="#36A2EB" name="Law Discussion Room" />
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
                className="sort-by bg-gray-200 border-grey py-1 px-3 rounded-lg text-sm w-28"
              >
                {sortOrder}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Room:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-32"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="All">All</option>
                {[...new Set(reservations.map((res) => res.room))].map((room, idx) => (
                  <option key={idx} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Entries:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
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
            <label htmlFor="search" className="font-medium text-sm">
              Search:
            </label>
            <input
              type="text"
              id="search"
              className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
              placeholder="Room, booker, type, or purpose"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booker
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : displayedReservations.length > 0 ? (
                displayedReservations.map((res, index) => (
                  <tr key={index} className="hover:bg-light-gray cursor-pointer">
                    <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                      <div className="py-1 px-3 rounded-full bg-grey font-semibold truncate">{res.room}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {new Date(res.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{formatPeriod(res.period)}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => handleUserClick(res)}
                        className="text-sm text-arcadia-red font-semibold hover:underline"
                      >
                        {res.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{res.user_accounts?.userAccountType || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-center">{res.purpose}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-2 space-x-4">
          <button
            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">Page {currentPage}</span>
          <button
            className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomReserv
