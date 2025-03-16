import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import CurrentReservations from "../../components/UserComponents/user-room-reser-comp/CurrentReservations";
import ReservHero from "../../components/UserComponents/user-room-reser-comp/ReservHero";

const UDiscussionReserv = () => {
    React.useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1)
            const element = document.getElementById(id)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                }, 300)
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />

            <Title>Discussion Room Reservations</Title>

                <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
                    <div className="lg:w-1/4 lg:block md:hidden space-y-4">
                        <ArcOpHr />
                        <UpEvents />
                        <Services />
                    </div>

                    <div className="userMain-content lg:w-3/4 md:w-full">
                        <div id="reserv-a-room">
                            <ReservHero />
                        </div>
                        <div id="room-reservs lg:w-3/4 md:w-full">
                            <CurrentReservations />
                        </div>
                    </div>
                </div>
        </div>
    )
};

export default UDiscussionReserv;