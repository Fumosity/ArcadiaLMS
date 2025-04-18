import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"
import TicketResponse from "./TicketResponse"

const TicketDetails = ({ supportID, onBack, showBackButton = true }) => {
  const [supportData, setSupportData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSupportData = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.from("support_ticket").select("*").eq("supportID", supportID).single()

      if (error) {
        console.error("Error fetching support data:", error)
      } else {
        setSupportData(data)
      }
      setIsLoading(false)
    }

    if (supportID) {
      fetchSupportData()
    }
  }, [supportID])

  if (isLoading) {
    return <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">Loading...</div>
  }

  if (!supportData) {
    return <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">No support data found.</div>
  }

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Support Ticket Details</h3>
        {/* {showBackButton && (
          <button
            onClick={onBack}
            className="w-[300px] h-[44px] border border-grey rounded-xl px-5 text-center items-center text-md text-black hover:bg-light-gray transition-colors"
          >
            Back to Make Support
          </button>
        )} */}
      </div>
      <div className="flex items-center mb-4">
        <label className="text-sm mr-2 font-semibold">Type:</label>

          <select
            className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
            value={supportData.type}
            disabled
          >
            <option value={supportData.type}>{supportData.type}</option>
            <option value="Account">Account</option>
            <option value="Book">Book</option>
            <option value="Research">Research</option>
          </select>

          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-black"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>


        <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
        <input
          type="text"
          className="flex-1 px-2 py-1 border border-grey rounded-full text-sm placeholder-black text-left"
          value={supportData.subject}
          readOnly
        />
      </div>
      <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
      <textarea
        className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
        value={supportData.content}
        readOnly
      ></textarea>

      <TicketResponse supportID={supportID} />
    </div>
  )
}

export default TicketDetails

