import React from "react";
import Title from "../components/main-comp/Title";
import BCHistory from "../components/admin-book-circ-pg-comp/BCHistory";
import LibraryServicesCMS from "../components/admin-lib-analytics-comp/LibraryServicesCMS";
import LibraryServicesPreview from "../components/admin-lib-analytics-comp/LibraryServicesPreview";
import DragDropReorder from "../components/admin-lib-analytics-comp/DragDropReorder";

const AServices = () => {
    React.useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1)
            const element = document.getElementById(id)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                }, 300)
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <Title>Services</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4 space-y-2">
                <div id="book-circulation-demographics">
                <LibraryServicesCMS />
                </div>
                <div id="room-reserv-demographics">
                    <LibraryServicesPreview />
                </div>
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                    <DragDropReorder />
                </div>
            </div>
        </div>
    )
}

export default AServices;