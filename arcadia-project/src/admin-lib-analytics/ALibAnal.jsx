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
        <div className="min-h-screen bg-gray-100">
            <Title>Library Analytics</Title>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Main content for adding research */}
                            <RcntLibVisit />
                            <LibBookCirc />
                            <RoomReserv />
                    </div>

                    {/* Preview section */}
                    <div className="lg:col-span-1 space-y-8">
                            <MostPop />
                            <LeastPop />
                            <HighRates />
                            <LowRates />
                    </div>
                </div>
            </main>
        </div>
);

export default ALibAnal;