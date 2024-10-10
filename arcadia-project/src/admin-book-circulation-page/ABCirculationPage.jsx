import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import BookCircView from "../components/admin-book-circ-pg-comp/BookCircView";
import BookCirculationTable from "../components/admin-home-page-comp/BookCirculationTable";
import BorrowedBooks from "../components/admin-book-circ-pg-comp/BorrowedBooks";
import AccessTable from "../components/admin-home-page-comp/AccessTable";

export default function ABCirculationPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <MainHeader />
            <Navbar />
            <BookCircView />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">                   
                        
                            <BorrowedBooks />
                        
                    </div>

                    {/* Access Table and other sections on the right */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <AccessTable />
                        </div>

                    </div>



                </div>
            </main>

        </div>
    );
}