import { useNavigate } from "react-router-dom"

const ReservHero = () => {
  const navigate = useNavigate()

  const handleReserveClick = () => {
    // Create query parameters for type and subject
    const queryParams = new URLSearchParams({
      type: "Room Reservation",
      subject: "Request to reserve room",
    }).toString()

    // Navigate to the support ticket page with query parameters
    navigate(`/user/support/supportticket?${queryParams}`)
  }

  return (
    <div className="uHero-cont">
      <section className="userHero relative">
        <div className="absolute inset-0">
          <img src="/image/reservHero.png" alt="Hero Background" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="relative z-10">
          <h1 className="userHero-title text-white">
            Reserve discussion rooms <br />
            for group presentations, <br /> consultations, and meetings.
          </h1>
          <button
            onClick={handleReserveClick}
            className="mt-8 px-3 py-1 border border-white rounded-full w-auto text-white hover:bg-white hover:text-arcadia-red hover:border-arcadia-red"
          >
            Click here to reserve a room
          </button>
        </div>
      </section>
    </div>
  )
}

export default ReservHero

