import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";
import ReportStatus from "../../components/UserComponents/user-report-comp/ReportStatus";
import MakeReport from "../../components/UserComponents/user-report-comp/MakeReport";

const UReports = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <UsearchBar />
            <Title>User Reports</Title>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div class="fuserContent-container items-center justify-center mt-2.5 mb-2.5">
                    <div class="w-full max-w-full">
                        <div class="space-y-8">
                            <div class="flex justify-center">
                                <ReportStatus />
                            </div>
                            <div class="flex justify-center">
                                <MakeReport />
                            </div>
                        </div>
                    </div>
                </div>
            </main>



        </div>
    )
};

export default UReports;