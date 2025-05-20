import { useEffect } from "react"
import RsrchCards from "../user-home-comp/RsrchCards"
import { supabase } from "../../../supabaseClient"

const fetchNewlyAddedResearch = async () => {
  try {
    // First, fetch active colleges
    const { data: collegeData, error: collegeError } = await supabase
      .from("college_list")
      .select("college")
      .eq("isarchived", false)

    if (collegeError) throw collegeError

    // Extract college abbreviations
    const activeColleges = collegeData.map((college) => college.college)

    // Fetch research from active colleges only
    const { data: research, error } = await supabase
      .from("research")
      .select("*")
      .in("college", activeColleges) // Only include research from active colleges
      .order("pubDate", { ascending: false })
      .limit(15)

    if (error) throw error

    console.log({ research })
    return { research }
  } catch (error) {
    console.error("Error fetching newly added research:", error)
    return { research: [] }
  }
}

const NewAddResearch = ({ researchID, onSeeMoreClick }) => {
  useEffect(() => {
    fetchNewlyAddedResearch()
  }, [researchID])

  return (
    <RsrchCards
      title="Recently Published"
      fetchResearch={fetchNewlyAddedResearch}
      onSeeMoreClick={() => onSeeMoreClick("Recently Published", fetchNewlyAddedResearch)}
    />
  )
}

export default NewAddResearch
