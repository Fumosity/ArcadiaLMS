import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";

import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";

import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import LibServ from "../../components/UserComponents/user-serv-comp/LibServ";
import ReportStatus from "../../components/UserComponents/user-report-comp/ReportStatus";
import MakeReport from "../../components/UserComponents/user-report-comp/MakeReport";
import ReportDetails from "../../components/UserComponents/user-report-view-comp/ReportDetails";
import SupportTixStatus from "../../components/UserComponents/user-support-tix-comp/SupportTixStatus";
import FileATix from "../../components/UserComponents/user-support-tix-comp/FileATix";
import TicketDetails from "../../components/UserComponents/user-supportTix-view-comp/TicketDetails";

const USupportTixView = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <UsearchBar />
            <Title>User Report View</Title>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div class="fuserContent-container items-center justify-center mt-2.5 mb-2.5">
                    <div class="w-full max-w-full">
                        <div class="space-y-8">
                            <div class="flex justify-center">
                                <SupportTixStatus />
                            </div>
                            <div class="flex justify-center">
                                <TicketDetails />
                            </div>
                        </div>
                    </div>
                </div>
            </main>



        </div>
    )
};

export default USupportTixView;