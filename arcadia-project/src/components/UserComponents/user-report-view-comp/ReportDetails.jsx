"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"
import ReportResponse from "./ReportResponse"

const ReportDetails = ({ reportID, onBack }) => {
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.from("report_ticket").select("*").eq("reportID", reportID).single()

      if (error) {
        console.error("Error fetching report data:", error)
      } else {
        setReportData(data)
      }
      setIsLoading(false)
    }

    if (reportID) {
      fetchReportData()
    }
  }, [reportID])

  if (isLoading) {
    return <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">Loading...</div>
  }

  if (!reportData) {
    return <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">No report data found.</div>
  }

  return (
    <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Report Details</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-arcadia-red text-white rounded-full hover:bg-grey transition-colors hover:text-black"
        >
          Back to Make Report
        </button>
      </div>
      <div className="flex items-center mb-4">
        <label className="text-sm mr-2 font-semibold">Type:</label>
        <select
          className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
          value={reportData.type}
          disabled
        >
          <option value="select-type" className="text-center text-grey">
            Select Type
          </option>
          <option value="system" className="text-center">
            System
          </option>
          <option value="book" className="text-center">
            Book
          </option>
          <option value="research" className="text-center">
            Research
          </option>
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
          value={reportData.subject}
          readOnly
        />
      </div>
      <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
      <textarea
        className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
        value={reportData.content}
        readOnly
      ></textarea>

      <ReportResponse reportID={reportID} />
    </div>
  )
}

export default ReportDetails

