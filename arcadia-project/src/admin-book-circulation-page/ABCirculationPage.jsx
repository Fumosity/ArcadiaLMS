import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import BorrowedBks from "../components/admin-book-circ-pg-comp/BorrowedBks";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";
import ReturnedBks from "../components/admin-book-circ-pg-comp/ReturnedBks";
import OverdueBks from "../components/admin-book-circ-pg-comp/OverdueBks";
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
export default function ABCirculationPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <MainHeader />
            <Title>Book Circulation</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 gap-8">
                <div className="flex-shrink-0 mt-4">
                    <BCHistory />

                    <div className="mt-4">
                        <BorrowedBks />
                    </div>

                    <div className="mt-4">
                        <ReturnedBks />
                    </div>

                    <div className="mt-4">
                        <OverdueBks />
                    </div>
                </div>


                <div className="lg:col-span-1 space-y-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <AccessTable />
                    </div>
                    <div className="mt-4">
                        <BksDueTdy />
                    </div>
                </div>
            </div>

            <footer className="bg-light-gray mt-12 py-8">
                <Footer />
            </footer>
            <Copyright />

        </div>
    );
}