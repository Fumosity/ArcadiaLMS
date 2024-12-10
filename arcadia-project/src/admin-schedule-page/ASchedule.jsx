import React from "react";

import WeeklySched from "../components/admin-schedule-comp/WeeklySched";
import Title from "../components/main-comp/Title";
import CalendarEvents from "../components/admin-schedule-comp/CalendarEvents";
import ArcOpHr from "../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../components/UserComponents/user-home-comp/UpEvents";

const AAccountSettings = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <Title>Schedule</Title>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <WeeklySched />
                        {/* <CalendarEvents /> */}
                    </div>

                    {/* Preview section */}
                    <div className="md:col-span-1 space-y-8">
                        <ArcOpHr />
                        <UpEvents />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AAccountSettings;
