import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"

const TicketResponse = ({ supportID }) => {
  const [reply, setReply] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSupportReply = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("support_ticket")
        .select("supportReply")
        .eq("supportID", supportID)
        .single()

      if (error) {
        console.error("Error fetching support reply:", error)
      } else {
        setReply(data.supportReply || "")
      }
      setIsLoading(false)
    }

    if (supportID) {
      fetchSupportReply()
    }
  }, [supportID])

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

export default TicketResponse

