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
        <div className="min-h-screen bg-gray-100">
            <Title>Book Circulation</Title>
            <div className="flex flex-wrap justify-center gap-8 pb-12">
                <div className="flex flex-col gap-4 mt-4 w-full sm:w-auto">
                    <BCHistory />
                    <BorrowedBks />
                    <ReturnedBks />
                    <OverdueBks />
                </div>

                <div className="w-full sm:w-auto space-y-8 mt-4">
                    <AccessTable />
                    <BksDueTdy />
                </div>
            </div>
        </div>
    );
}
