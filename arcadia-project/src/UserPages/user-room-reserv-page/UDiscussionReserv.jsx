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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <ArcOpHr />
                        <UpEvents />
                        <Services />
                    </div>

                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        <div id="reserv-a-room">
                            <ReservHero />
                        </div>
                        <div id="room-reservs">
                            <CurrentReservations />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
};

export default UDiscussionReserv;