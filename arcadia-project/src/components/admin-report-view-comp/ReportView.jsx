import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { supabase } from "/src/supabaseClient.js"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const ReportView = () => {
  const location = useLocation()
  const ticket = location.state?.ticket
  const navigate = useNavigate()
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
      toast.success("Update submitted successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })

      setTimeout(() => {
        navigate("/admin/support")
      }, 2000)
    } catch (error) {
      console.error("Error submitting update:", error)
      toast.error("Failed to submit update. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTicket = async () => {
    if (!ticket || !ticket.reportID) return

    if (!confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("report_ticket").delete().eq("reportID", ticket.reportID)

      if (error) throw error

      toast.success("Report ticket deleted successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })

      setTimeout(() => {
        navigate("/admin/support")
      }, 2000)
    } catch (error) {
      console.error("Error deleting report ticket:", error)
      toast.error("Failed to delete report ticket. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatSchoolNo = (value) => {
    // Remove non-numeric characters
    let numericValue = value.replace(/\D/g, "")

    // Apply the XXXX-X-XXXXX format
    if (numericValue.length > 4) {
      numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`
    }
    if (numericValue.length > 6) {
      numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`
    }
    return numericValue
  }

  const reportFields = [
    { label: "School No.:", value: userData?.userLPUID || "Not Available" },
    { label: "Name:", value: userData ? `${userData.userFName} ${userData.userLName}` : "Not Available" },
    { label: "College:", value: userData?.userCollege || "Not Available" },
    { label: "Department:", value: userData?.userDepartment || "Not Available" },
    { label: "Date:", value: ticket?.date || "Not Available" },
    { label: "Time:", value: ticket?.time || "Not Available" },
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
    <div className="space-y-2">
      <div className="bg-white border border-grey p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-2">Report Details</h3>
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="space-y-2">
            {reportFields.map((field, index) => (
              <div key={index} className="flex justify-between items-center w-full">
                <label className="text-md capitalize w-1/3">{field.label}</label>
                <div className="px-3 py-1 rounded-full border border-grey w-2/3">
                  {isLoading ? (
                    <Skeleton width="100%" height={15} />
                  ) : field.label === "School No.:" ? (
                    field.value
                  ) : (
                    field.value
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="h-full flex flex-col justify-between">
            <div className="space-y-2">
              {responseFields.map((field, index) => (
                <div key={index} className="flex justify-between items-center w-full">
                  <label className="text-md capitalize w-1/3">{field.label}</label>
                  <div className="px-3 py-1 rounded-full border border-grey w-2/3">
                    {isLoading ? <Skeleton width="100%" height={10} /> : field.value}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="text-md capitalize w-1/3">Content:</label>
              <div className="px-3 py-1 border border-grey rounded-xl text-md min-h-[125px] mt-2">
                {isLoading ? <Skeleton count={3} height={20} /> : ticket?.content || "No content available"}
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-center mt-6">
          <button
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
            onClick={handleDeleteTicket}
            disabled={isSubmitting}
          >
            Delete Ticket
          </button>
        </div>
      </div>
      <div className="bg-white border border-grey p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-2">Report Response</h3>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-black text-md capitalize">Reply:</label>
          <textarea
            className="bg-white px-3 py-1 border border-grey rounded-xl text-mdtext-sm min-h-[150px]"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply here..."
          />
          <div className="flex items-center justify-center space-x-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`add-book w-1/2 px-4 py-2 rounded-lg border transition ${selectedStatus === button.status
                    ? "bg-arcadia-red text-white"
                    : "bg-light-gray text-black border-grey"
                  }`}
                onClick={() => handleStatusSelect(button.status)}
              >
                {button.label}
              </button>
            ))}
            <button
              className="add-book w-1/2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={submitReplyAndStatus}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportView

