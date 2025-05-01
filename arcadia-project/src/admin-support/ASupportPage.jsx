import React, {useEffect} from "react";
import Title from "../components/main-comp/Title";
import UserReports from "../components/admin-user-support-report-view-comp/UserReports";
import SupportTicket from "../components/admin-user-support-report-view-comp/SupportTicket";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";
import ReportSupportBarPlot from "../components/admin-user-support-report-view-comp/ReportSupportBarPlot";
import ReportSupportPieChart from "../components/admin-user-support-report-view-comp/ReportSupportPieChart";

const ASupportPage = () => {
    useEffect(() => {
        document.title = "Arcadia | Support";
    }, []);
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
            <Title>Support Tickets and Reports</Title>

            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                    <div id="reports-and-supports-over-time">
                        <ReportSupportBarPlot />
                    </div>
                    <div id="reports-and-supports-status">
                        <ReportSupportPieChart />
                    </div>
                    <div id="user-reports">
                        <UserReports />
                    </div>
                    <div id="support-tickets">
                        <SupportTicket />
                    </div>
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                    <div className="space-y-2 w-full">
                        <RecentReports />
                        <RecentSupport />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ASupportPage;
