import { useState } from "react"
import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USearchBar";
import Title from "../../components/main-comp/Title";
import SupportTixStatus from "../../components/UserComponents/user-support-tix-comp/SupportTixStatus";
import FileATix from "../../components/UserComponents/user-support-tix-comp/FileATix";
import TicketDetails from "../../components/UserComponents/user-supportTix-view-comp/TicketDetails";

const USupportTix = () => {
    const [selectedSupportID, setSelectedSupportID] = useState(null)
    
    const handleSupportSelect = (supportID) => {
      setSelectedSupportID(supportID)
    }
  
    const handleBackToMakeSupport = () => {
      setSelectedSupportID(null)
    }
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <UsearchBar />
            <Title>Support Tickets</Title>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div class="fuserContent-container items-center justify-center mt-2.5 mb-2.5">
                    <div class="w-full max-w-full">
                        <div class="space-y-8">
                            <div class="flex justify-center">
                            <SupportTixStatus onSupportSelect={handleSupportSelect}/>
                            </div>
                            <div class="flex justify-center">
                            {selectedSupportID ? (
                                    <TicketDetails supportID={selectedSupportID} onBack={handleBackToMakeSupport}/>
                                ) : (
                                    <FileATix />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>



        </div>
    )
};

export default USupportTix;