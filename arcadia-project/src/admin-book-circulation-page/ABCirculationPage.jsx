import React from "react"
import BorrowedBks from "../components/admin-book-circ-pg-comp/BorrowedBks"
import AccessTable from "../components/admin-home-page-comp/AccessTable"
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory"
import ReturnedBks from "../components/admin-book-circ-pg-comp/ReturnedBks"
import OverdueBks from "../components/admin-book-circ-pg-comp/OverdueBks"
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy"
import Title from "../components/main-comp/Title"
import SBOverdue from "../components/admin-system-reports-comp/SBOverdue"
import DamagedBks from "../components/admin-book-circ-pg-comp/DamagedBks"

export default function ABCirculationPage() {
  // Check if there's a hash in the URL and scroll to it after render
  React.useEffect(() => {
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
    <div className="min-h-screen bg-white">
      <Title>Book Circulation</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-2">
          <div id="history">
            <BCHistory />
          </div>
          <div id="borrowed-books">
          </div>
          <div id="returned-books">
          </div>
          <div id="overdue-books">
            <OverdueBks />
          </div>
          <div id="damaged-books">
            <DamagedBks />
          </div>
        </div>

        <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
          <AccessTable />
          <BksDueTdy />
          <SBOverdue />
        </div>
      </div>
    </div>
  )
}

