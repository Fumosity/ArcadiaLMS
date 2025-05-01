import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import Title from "../../components/main-comp/Title"
import SupportTixStatus from "../../components/UserComponents/user-support-tix-comp/SupportTixStatus"
import FileATix from "../../components/UserComponents/user-support-tix-comp/FileATix"
import TicketDetails from "../../components/UserComponents/user-supportTix-view-comp/TicketDetails"
import ReturnSupportButton from "../../components/UserComponents/user-support-tix-comp/ReturnSupportButton"
import { ArrowLeft } from "lucide-react";

const USupportTix = () => {
  useEffect(() => {
          document.title = "Arcadia | Support";
      }, []);
  const [selectedSupportID, setSelectedSupportID] = useState(null)
  const [searchParams] = useSearchParams()

  const handleSupportSelect = (supportID) => {
    setSelectedSupportID(supportID)
  }

  const handleBackToMakeSupport = () => {
    setSelectedSupportID(null)
  }

  // Reset selectedSupportID when navigating to this page with query params
  useEffect(() => {
    if (searchParams.has("type") || searchParams.has("subject")) {
      setSelectedSupportID(null)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>Support Tickets</Title>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fuserContent-container items-center justify-center mt-2.5 mb-2.5">
          <div className="w-full max-w-full">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ReturnSupportButton />
                {selectedSupportID && (
                  <button
                    onClick={handleBackToMakeSupport}
                    className="w-[300px] h-[44px] border border-grey rounded-xl px-5 text-center items-center text-md text-black hover:bg-light-gray transition-colors"
                  >
                    {/* <span className="w-5 h-5 flex items-center justify-center">
                      <ArrowLeft className="w-3 h-3 text-white" />
                    </span> */}
                    Back to Make Support
                  </button>
                )}
              </div>
              <SupportTixStatus onSupportSelect={handleSupportSelect} />
              {selectedSupportID ? (
                <TicketDetails supportID={selectedSupportID} onBack={handleBackToMakeSupport} showBackButton={false} />
              ) : (
                <FileATix />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default USupportTix

