import { useState, useEffect } from "react"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import Title from "../../components/main-comp/Title"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import CurrentReservations from "../../components/UserComponents/user-room-reser-comp/CurrentReservations"
import ReservHero from "../../components/UserComponents/user-room-reser-comp/ReservHero"

const UDiscussionReserv = () => {
  useEffect(() => {
    document.title = "Arcadia | Room Reservation";
}, []);
  const [holidays, setHolidays] = useState({})
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Function to fetch holidays from API
  const fetchHolidays = async (year) => {
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PH`)
      if (!response.ok) {
        throw new Error("Failed to fetch holidays")
      }
      const data = await response.json()

      // Convert to an object with dates as keys for easier lookup
      const holidayMap = {}
      data.forEach((holiday) => {
        const date = holiday.date
        holidayMap[date] = holiday.name
      })

      setHolidays(holidayMap)

      // Store holidays in sessionStorage for other components to access
      sessionStorage.setItem("philippineHolidays", JSON.stringify(holidayMap))
    } catch (error) {
      console.error("Error fetching holidays:", error)
    }
  }

  // Fetch holidays when the component mounts or year changes
  useEffect(() => {
    fetchHolidays(currentYear)
  }, [currentYear])

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />

      <Title>Discussion Room Reservations</Title>

      <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
        <div className="lg:w-1/4 lg:block md:hidden space-y-4">
          <ArcOpHr />
          <UpEvents />
          <Services />
        </div>

        <div className="userMain-content lg:w-3/4 md:w-full">
          <div id="reserv-a-room">
            <ReservHero />
          </div>
          <div id="room-reservs lg:w-3/4 md:w-full">
            <CurrentReservations holidays={holidays} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UDiscussionReserv