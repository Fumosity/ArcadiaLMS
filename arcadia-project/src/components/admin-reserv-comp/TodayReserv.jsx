"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const TodayReserv = () => {
  const [roomRes, setRoomRes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Function to convert 24-hour format to 12-hour format with AM/PM
  const formatTime = (time) => {
    if (!time) return ""

    // Parse the time (assuming format is HH:MM)
    const [hours, minutes] = time.split(":").map((num) => Number.parseInt(num, 10))

    // Convert to 12-hour format
    const period = hours >= 12 ? "PM" : "AM"
    const hours12 = hours % 12 || 12 // Convert 0 to 12 for 12 AM

    // Format the time with leading zeros for minutes
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const fetchReservations = useCallback(async () => {
    setIsLoading(true)
    const today = new Date().toISOString().split("T")[0] // Get today's date (YYYY-MM-DD)
    console.log("Today's Date:", today)

    const { data: reservations, error } = await supabase
      .from("reservation")
      .select(`
      reservationData, 
      userID,
      user_accounts:userID (
        userFName,
        userLName
      )
    `)
      .eq("reservationData->>date", today)

    if (error) {
      console.error("Error fetching reservations:", error)
      setRoomRes([])
      setIsLoading(false)
      return
    }

    console.log("Fetched reservations:", reservations)

    if (!reservations || reservations.length === 0) {
      console.warn("No reservations found for today.")
      setRoomRes([])
      setIsLoading(false)
      return
    }

    // Transform the data to the format needed for display
    const formattedReservations = reservations.map((reservation) => {
      const { room, startTime, endTime } = reservation.reservationData

      // Format the start and end times
      const formattedStartTime = formatTime(startTime)
      const formattedEndTime = formatTime(endTime)

      return {
        room,
        time: `${formattedStartTime} - ${formattedEndTime}`,
        booker: `${reservation.user_accounts.userFName} ${reservation.user_accounts.userLName}`,
        userID: reservation.userID,
      }
    })

    setRoomRes(formattedReservations)
    setIsLoading(false)
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("reservation_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservation",
        },
        () => {
          fetchReservations()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchReservations])

  const handleUserClick = (userID) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Today's Reservations</h3>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booker
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                  <td className="px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                  <td className="px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                </tr>
              ))
            ) : roomRes.length > 0 ? (
              roomRes.map((room, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-3 py-2 text-left text-sm text-black">{room.room}</td>
                  <td className="px-3 py-2 text-left text-sm text-black">{room.time}</td>
                  <td className="px-3 py-2 text-left text-sm text-arcadia-red font-semibold">
                    <button onClick={() => handleUserClick(room.userID)} className="text-blue-500 hover:underline">
                      {room.booker}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-sm">
                  No reservations found for today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TodayReserv

