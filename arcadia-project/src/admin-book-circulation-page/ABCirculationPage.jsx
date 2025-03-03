import React from "react";
import BorrowedBks from "../components/admin-book-circ-pg-comp/BorrowedBks";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";
import ReturnedBks from "../components/admin-book-circ-pg-comp/ReturnedBks";
import OverdueBks from "../components/admin-book-circ-pg-comp/OverdueBks";
import BksDueTdy from "../components/admin-book-circ-pg-comp/BksDueTdy";
import Title from "../components/main-comp/Title";

export default function ABCirculationPage() {
    return (
        <div className="min-h-screen bg-white">
            <Title>Book Circulation</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                    <BCHistory />
                    <BorrowedBks />
                    <ReturnedBks />
                    <OverdueBks />
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                    <AccessTable />
                    <BksDueTdy />
                </div>
            </div>
        </div>
    );
}
