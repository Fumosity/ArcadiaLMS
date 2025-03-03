import React from "react";

import WeeklySched from "../components/admin-schedule-comp/WeeklySched";
import Title from "../components/main-comp/Title";
import CalendarEvents from "../components/admin-schedule-comp/CalendarEvents";
import ArcOpHr from "../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../components/UserComponents/user-home-comp/UpEvents";

const AAccountSettings = () => {
    return (
        <div className="min-h-screen bg-white">
            <Title>Schedule</Title>

                <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                    <div className="flex-shrink-0 w-3/4 space-y-2">
                        <WeeklySched />
                        {/* <CalendarEvents /> */}
                    </div>

                    {/* Preview section */}
                    <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                        <div className="space-y-2 w-full">
                        <ArcOpHr />
                        <UpEvents />
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default AAccountSettings;
