import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import RcntLibVisit from "../components/admin-user-acc-comp/RcntLibVisit";
import LibBookCirc from "../components/admin-lib-analytics-comp/LibBookCirc";
import RoomReserv from "../components/admin-lib-analytics-comp/RoomReserv";
import MostPop from "../components/admin-lib-analytics-comp/MostPop";
import LeastPop from "../components/admin-lib-analytics-comp/LeastPop";
import HighRates from "../components/admin-lib-analytics-comp/HighRates";
import LowRates from "../components/admin-lib-analytics-comp/LowRates";
import Title from "../components/main-comp/Title";

const ALibAnal = () => (
    <div className="min-h-screen bg-white">
        <Title>Library Analytics</Title>
        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4 space-y-2">
                <RcntLibVisit />
                <LibBookCirc />
                <RoomReserv />
            </div>

            <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                <MostPop />
                <LeastPop />
                <HighRates />
                <LowRates />
            </div>
        </div>
    </div>
);

export default ALibAnal;