import React from "react";

import WeeklySched from "../components/admin-schedule-comp/WeeklySched";
import Title from "../components/main-comp/Title";
import OperatingHours from "../components/admin-schedule-comp/OperatingHours";
import EventView from "../components/admin-schedule-comp/EventView";

const AAccountSettings = () => {
    return (
        <div className="min-h-screen bg-white">
            <Title>Schedule</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                    <WeeklySched />
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">

                    <OperatingHours />
                    <EventView />
                </div>

            </div>

        </div>
    );
};

export default AAccountSettings;
