import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Title from "../components/main-comp/Title";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy";
import CheckingContainer from "../components/admin-book-checkout/CheckingContainer";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";

const ABCheckOut = () => (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <MainHeader />
        <Navbar />
        <Title>Book Checking</Title>
        <main className="flex-grow flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">

                        <CheckingContainer />
                        <BCHistory />
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <AccessTable />
                        </div>
                        <BksDueTdy />


                    </div>
                </div>
            </div>
        </main>
        <footer className="bg-light-gray mt-12 py-8">
            <Footer />
        </footer>
        <Copyright />
    </div>
);
export default ABCheckOut;