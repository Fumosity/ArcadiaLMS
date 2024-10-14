import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import RcntLibVisit from "../components/admin-user-acc-comp/RcntLibVisit";
import ListOfAcc from "../components/admin-user-acc-comp/ListOfAcc";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import Blacklist from "../components/admin-user-acc-comp/Blacklist";
import Whitelist from "../components/admin-user-acc-comp/Whitelist";
import SupportTix from "../components/admin-user-acc-comp/SupportTix";
import UserReports from "../components/admin-user-acc-comp/UserReports";
import Title from "../components/main-comp/Title";

const AUsrAcc = () => (

        <div className="min-h-screen bg-gray-100">
            <MainHeader />
            <Navbar />
            <Title>User Accounts</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Main content for adding research */}
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <RcntLibVisit />
                        </div>
                        <ListOfAcc />

                    </div>

                    {/* Preview section */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <AccessTable />
                        </div>

                            <Blacklist />

                            <Whitelist />

                            <UserReports />

                            <SupportTix />
                    </div>
                </div>
            </main>

            <footer className="bg-light-gray mt-12 py-8">
                <Footer />
            </footer>
            <Copyright />
        </div>
);

export default AUsrAcc;