import React from "react";
import Title from "../components/main-comp/Title";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy";
import CheckingContainer from "../components/admin-book-check-in-out-comp/CheckingContainer";


const ABChecking = () => (
    <div className="min-h-screen bg-white flex flex-col">
        <Title>Book Checking</Title>
        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4 space-y-2">
                <CheckingContainer />
                {/* <BCHistory /> */}
            </div>
            <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                <AccessTable />
                <BksDueTdy />
            </div>
        </div>
    </div>
);
export default ABChecking;