import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"

const ReportResponse = ({ reportID }) => {
  const [reply, setReply] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReportReply = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("report_ticket")
        .select("reportReply")
        .eq("reportID", reportID)
        .single()

      if (error) {
        console.error("Error fetching report reply:", error)
      } else {
        setReply(data.reportReply || "")
      }
      setIsLoading(false)
    }

    if (reportID) {
      fetchReportReply()
    }
  }, [reportID])

  if (isLoading) {
    return <div>Loading response...</div>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Response</h3>
      <div className="items-center">
        <label className="text-sm font-semibold mr-2">Most Recent Reply:</label>
        <textarea
          className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
          value={reply}
          readOnly
        ></textarea>
      </div>
    </div>
  )
}

export default ReportResponse

