import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react";

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

  const images = [
    "/image/room1.JPG",
    "/image/room2.JPG",
    "/image/room3.JPG",
    "/image/arc4.JPG",
    "/image/arc5.JPG",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change every 5 seconds
  
      return () => clearInterval(interval);
    }, [images.length]);

  return (
    <div className="uHero-cont">
      <section className="userHero relative overflow-hidden rounded-lg w-full h-[500px]">
      {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Hero Background ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
                            }`}
                    />
                ))}

        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-center w-full h-full px-4 py-16 bg-black/50">
          <h1 className="justify-start text-left userHero-title pl-4 text-white text-4xl md:text-5xl font-bold mb-4">
            Reserve discussion rooms <br />
            for group presentations, <br /> consultations, and meetings.
          </h1>
          <button
            onClick={handleReserveClick}
            className="px-6 py-2 border border-white ml-4 rounded-full text-white hover:bg-arcadia-red hover:border-arcadia-red transition duration-300"
          >
            Click here to reserve a room
          </button>
        </div>
      </section>
    </div>
  )
}

export default ReservHero

