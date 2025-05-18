import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const FeaturedResearch = ({ refreshKey }) => {
    const [research, setResearch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const formatAuthor = (authors) => {
        if (!authors || !Array.isArray(authors) || authors.length === 0) {
            return "Unknown Author"
        }

        return authors
            .map((authorName) => {
                const trimmedName = authorName.trim()
                const names = trimmedName.split(" ")
                const lastName = names.pop()
                const initials = names.map((name) => name[0] + ".").join("")
                return initials ? `${initials} ${lastName}` : lastName
            })
            .join(", ")
    }

    useEffect(() => {
        const fetchLatestFeaturedResearch = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch only from the "featured_research" table
                const { data: featuredResearchData, error: featuredResearchError } = await supabase
                    .from("featured_research")
                    .select("*, research(*)")
                    .order("created_at", { ascending: false })
                    .limit(1);

                console.log("Raw featured research data:", featuredResearchData);

                if (featuredResearchError) throw featuredResearchError;

                if (featuredResearchData && featuredResearchData.length > 0) {
                    console.log("Successfully fetched featured research:", featuredResearchData[0]);
                    setResearch(featuredResearchData[0]);
                } else {
                    console.warn("No featured research data found.");
                    setResearch(null);
                }
            } catch (err) {
                console.error("Error fetching featured research:", err);
                setError("Failed to fetch the featured research.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestFeaturedResearch()
    }, [refreshKey])

    if (isLoading) return <div>Loading featured research...</div>
    if (error) return <div>{error}</div>
    if (!research) return <div>No featured research found.</div>

    return (

        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Featured Research</h2>
            </div>
            <div className="genCard-cont flex flex-col w-full h-[35vh]  gap-4 p-4 border border-grey bg-silver rounded-lg mt-4">
                <div className="w-full flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="w-3/4 text-xl h-auto leading-tight font-ZenSerif whitespace-pre-wrap line-clamp-2 mb-1 truncate break-words">
                            {research.research.title}
                        </h3>
                        {research.research.pdf && (
                            <div className="w-1/4 bg-arcadia-red rounded-full font-semibold text-white text-center text-xs px-2 py-1">
                                Preview Available
                            </div>
                        )}
                    </div>
                    <p className="text-md text-gray-400 mb-1 truncate">
                        {research.research.college}
                        <span className="ml-1">
                            {research.research.department && research.research.department !== "N/A" && `- ${research.research.department} `}
                        </span>
                        <span className="">&nbsp;•&nbsp;&nbsp;{research.research.pubDate}</span>
                    </p>
                    <p className="w-full leading-tight line-clamp-4 overflow-hidden text-ellipsis break-words">
                        <span className="font-semibold">Librarian's Notes:</span><br />
                        "<span className="italic">{research.notes || "No notes available."}</span>"
                    </p>
                </div>
                <div className="flex align-baseline items-center justify-start gap-2 w-1/3 absolute bottom-4">
                    <button
                        className="hover:bg-arcadia-red rounded-lg hover:text-white text-center text-sm px-2 py-1 bg-white text-arcadia-red border border-arcadia-red w-full"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                            navigate(`/user/researchview?researchID=${research.research.researchID}`)
                        }}
                    >
                        View Research
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FeaturedResearch
