import React from "react";
import RcntLibVisit from "../components/admin-user-acc-comp/RcntLibVisit";
import RoomReserv from "../components/admin-lib-analytics-comp/RoomReserv";
import MostPop from "../components/admin-lib-analytics-comp/MostPop";
import LeastPop from "../components/admin-lib-analytics-comp/LeastPop";
import HighRates from "../components/admin-lib-analytics-comp/HighRates";
import LowRates from "../components/admin-lib-analytics-comp/LowRates";
import Title from "../components/main-comp/Title";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";

const ALibAnal = () => {
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
        <div className="min-h-screen bg-white">
            <Title>Library Analytics</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                <div id="book-circulation-demographics">
                <RcntLibVisit />
                </div>
                <div id="history">
                    <BCHistory />
                </div>
                    <BCHistory />
                <div id="room-reserv-demographics">
                    <RoomReserv />
                </div>
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                    <MostPop />
                    <LeastPop />
                    <HighRates />
                    <LowRates />
                </div>
            </div>
        </div>
    )
}

export default ALibAnal;