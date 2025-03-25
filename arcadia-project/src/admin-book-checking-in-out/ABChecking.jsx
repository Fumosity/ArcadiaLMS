import { useRef } from "react"
import Title from "../components/main-comp/Title"
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy"
import CheckingContainer from "../components/admin-book-check-in-out-comp/CheckingContainer"
import BookRequests from "../components/admin-book-check-in-out-comp/BookRequests"
import OverdueBks from "../components/admin-book-circ-pg-comp/OverdueBks"
import BCSideButtons from "../components/admin-book-circ-pg-comp/BCSideButtons"

const ABChecking = () => {
  // Create a ref to access the CheckingContainer methods
  const checkingContainerRef = useRef(null)

  // Handle reservation selection
  const handleReservationSelect = (reservation) => {
    // Access the fillFormFromReservation function through the window object
    // This is a workaround since we can't directly modify the CheckingContainer to accept refs
    if (window.fillFormFromReservation) {
      window.fillFormFromReservation(reservation)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Title>Book Checking</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-2">
          <CheckingContainer ref={checkingContainerRef} />
          <OverdueBks/>
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
          <BCSideButtons />
          <BksDueTdy />
         
        </div>
      </div>
    </div>
  )
}

export default ABChecking