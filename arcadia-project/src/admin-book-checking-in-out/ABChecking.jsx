import React from "react";

import Title from "../components/main-comp/Title";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy";
import CheckingContainer from "../components/admin-book-check-in-out-comp/CheckingContainer";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";
import MainHeader from "../components/main-comp/MainHeader";

const ABChecking = () => (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <Title>Book Checking</Title>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <CheckingContainer />
                        <BCHistory />
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <AccessTable />
                        <BksDueTdy />
                    </div>
                </div>
            </div>
    </div>
);
export default ABChecking;