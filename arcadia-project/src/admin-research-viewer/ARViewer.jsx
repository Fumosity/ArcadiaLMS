import React from "react";
import Title from "../components/main-comp/Title";
import ARTitle from "../components/admin-research-viewer/ARTitle";
import ARFullText from "../components/admin-research-viewer/ARFullText";
import ARAbout from "../components/admin-research-viewer/ARAbout";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import ARPastReview from "../components/admin-research-viewer/ARPastReview";

const ARViewer = () => (
    <div className="min-h-screen bg-gray-100">
        <Title>User Account Viewer</Title>

        {/* Main content section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Left side content */}
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <ARTitle />
                    </div>
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <ARFullText/>
                    </div>
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <ARPastReview/>
                    </div>
                </div>

                {/* Right side content */}
                <div className="lg:col-span-1 space-y-8">
                    <ARAbout />
                    <PopularAmong />
                    <SimilarTo />
                </div>
            </div>
        </main>
    </div>
);

export default ARViewer;
