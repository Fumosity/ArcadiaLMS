"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { supabase } from "/src/supabaseClient.js"

const ReportView = () => {
  const location = useLocation()
  const ticket = location.state?.ticket

  const [isLoading, setIsLoading] = useState(true)
  const [reply, setReply] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, get the complete report data including userID
        if (ticket?.reportID) {
          const { data: reportData, error: reportError } = await supabase
            .from("report_ticket")
            .select(`
              *,
              user_accounts:userID (
                userID,
                userLPUID,
                userFName,
                userLName,
                userCollege,
                userDepartment
              )
            `)
            .eq("reportID", ticket.reportID)
            .single()

          if (reportError) {
            console.error("Error fetching report data:", reportError)
            return
          }

          if (reportData && reportData.user_accounts) {
            setUserData(reportData.user_accounts)
            // Update ticket data with the fresh data
            setSelectedStatus(reportData.status)
          }
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (ticket) {
      fetchUserData()
    } else {
      setIsLoading(false)
    }
  }, [ticket])

  const handleStatusSelect = (status) => {
    setSelectedStatus(status)
  }

  const submitReplyAndStatus = async () => {
    if (!ticket) return

    setIsSubmitting(true)

    const updates = {}
    if (reply.trim()) {
      updates.reportReply = reply
    }
    if (selectedStatus) {
      updates.status = selectedStatus
    }

    if (Object.keys(updates).length === 0) {
      alert("No changes to submit.")
      setIsSubmitting(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("report_ticket")
        .update(updates)
        .eq("reportID", ticket.reportID)
        .select(`
          *,
          user_accounts:userID (
            userID,
            userLPUID,
            userFName,
            userLName,
            userCollege,
            userDepartment
          )
        `)
        .single()

      if (error) throw error

      // Update local state with fresh data
      if (data.user_accounts) {
        setUserData(data.user_accounts)
      }
      setReply("")
      alert("Update submitted successfully!")
    } catch (error) {
      console.error("Error submitting update:", error)
      alert("Failed to submit update. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const reportFields = [
    { label: "User ID*:", value: userData?.userID || "Not Available" },
    { label: "School ID No.*:", value: userData?.userLPUID || "Not Available" },
    { label: "Name*:", value: userData ? `${userData.userFName} ${userData.userLName}` : "Not Available" },
    { label: "College*:", value: userData?.userCollege || "Not Available" },
    { label: "Department*:", value: userData?.userDepartment || "Not Available" },
    { label: "Date and time of report:", value: ticket?.date || "Not Available" },
  ]

  const responseFields = [
    { label: "Type:", value: ticket?.type || "Not Available" },
    { label: "Subject:", value: ticket?.subject || "Not Available" },
  ]

  const buttons = [
    { label: "Mark as Resolved", status: "Resolved" },
    { label: "Mark as Ongoing", status: "Ongoing" },
    { label: "Mark as Intended", status: "Intended" },
  ]

  if (!ticket) {
    return <div className="text-center">No report selected. Please select a report from the list.</div>
  }

  return (
    <div className="bg-white border border-grey p-4 rounded-lg">
        <h3 className="text-2xl font-semibold">Report Details</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2.5 w-full text-base text-black">
        <div className="space-y-2">
          {reportFields.map((field, index) => (
            <div key={index} className="flex justify-between w-full">
              <label className="text-sm">{field.label}</label>
              <div className="px-2 py-1 border border-grey rounded-md text-sm w-[60%] text-zinc-700">
                {isLoading ? <Skeleton width="100%" height={15} /> : field.value}
              </div>
            </div>
          ))}
          <p className="mt-2 text-xs text-gray-500">*Autofilled data</p>
        </div>

        <div className="space-y-2">
          {responseFields.map((field, index) => (
            <div key={index} className="flex justify-between w-full">
              <label className="text-sm">{field.label}</label>
              <div className="px-2 py-1 border border-grey rounded-md text-sm w-[60%] text-zinc-700">
                {isLoading ? <Skeleton width="100%" height={10} /> : field.value}
              </div>
            </div>
          ))}
          <label className="mt-4 text-sm">Content:</label>
          <div className="p-2 border border-grey rounded-md text-sm text-dark-grey min-h-[100px] mt-2">
            {isLoading ? <Skeleton count={3} height={20} /> : ticket?.content || "No content available"}
          </div>
        </div>
      </div>

      <h2 className="px-2.5 mt-4 w-full">Response</h2>

      <div className="flex flex-wrap lg:flex-nowrap gap-4 p-1 w-full text-base">
        <div className="flex flex-col items-center justify-center lg:w-1/2 space-y-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`py-2 px-6 rounded-full border ${
                selectedStatus === button.status ? "bg-red text-white" : "bg-dark-gray text-grey"
              }`}
              onClick={() => handleStatusSelect(button.status)}
            >
              {button.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col w-full lg:w-1/2">
          <label className="text-black">Reply:</label>
          <textarea
            className="p-2 mt-2 w-full rounded-md border border-zinc-300 text-sm min-h-[100px]"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply here..."
          />
          <button
            className="mt-2 py-2 px-6 text-white rounded-full border bg-arcadia-red"
            onClick={submitReplyAndStatus}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Update"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportView

