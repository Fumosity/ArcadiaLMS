import { useNavigate } from "react-router-dom"

export default function RsrchAvailability({ research }) {
  const navigate = useNavigate()

  const callNo = research.researchCallNum
  const callNoPrefix = callNo.split("-")[0].trim()
  let currentLocation = ""

  if (!isNaN(callNoPrefix)) {
    // If callNoPrefix is a number
    currentLocation = "4th Floor, Highschool and Multimedia Section"
  } else {
    // Extract year from pubDate (assuming it's a string in "yyyy-mm-dd" format)
    const pubYear = research.pubDate

    if (pubYear <= 2009) {
      currentLocation = "4th Floor, Circulation Section"
    } else {
      currentLocation = "2nd Floor, Circulation Section"
    }
  }

  const handleContactHelpDesk = () => {
    // Create query parameters for type and subject
    const queryParams = new URLSearchParams({
      type: "Research",
      subject: `Inquiry about research: ${research.researchCallNum}`,
    }).toString()

    // Navigate to the support ticket page with query parameters
    navigate(`/user/support/supportticket?${queryParams}`)
  }

  return (
    <div className="uSidebar-filter">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-xl font-semibold">Availability</h2>
      </div>

      <div className="flex m-6 item-center justify-center text-center ">
        <div className="text-lg">
          <span className="text-green font-semibold">✓</span>
          <span className="ml-2">Paper is Available</span>
        </div>
      </div>

      <div className="item-center justify-center text-center text-black mb-2">
        <p className="text-sm">Call Number:</p>
        <h4 className="text-lg font-semibold mb-2">{research.researchCallNum}</h4>
        <p className="text-sm">Location:</p>
        <h4 className="text-md">{currentLocation}</h4>
      </div>

      <button
        className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-4 rounded-xl text-sm"
        onClick={handleContactHelpDesk}
      >
        Contact the Help Desk
      </button>
    </div>
  )
}

