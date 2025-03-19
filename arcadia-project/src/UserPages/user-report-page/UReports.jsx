import { useState } from "react"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import UsearchBar from "../../components/UserComponents/user-main-comp/USearchBar"
import Title from "../../components/main-comp/Title"
import ReportStatus from "../../components/UserComponents/user-report-comp/ReportStatus"
import MakeReport from "../../components/UserComponents/user-report-comp/MakeReport"
import ReportDetails from "../../components/UserComponents/user-report-view-comp/ReportDetails"
import ReturnSupportButton from "../../components/UserComponents/user-support-tix-comp/ReturnSupportButton"

const UReports = () => {
  const [selectedReportID, setSelectedReportID] = useState(null)

  const handleReportSelect = (reportID) => {
    setSelectedReportID(reportID)
  }

  const handleBackToMakeReport = () => {
    setSelectedReportID(null)
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>User Reports</Title>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fuserContent-container items-center justify-center mt-2.5 mb-2.5">
          <div className="w-full max-w-full">
            <div className="space-y-4">
              <ReturnSupportButton />
                <ReportStatus onReportSelect={handleReportSelect} />
                {selectedReportID ? (
                  <ReportDetails reportID={selectedReportID} onBack={handleBackToMakeReport} />
                ) : (
                  <MakeReport />
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UReports

