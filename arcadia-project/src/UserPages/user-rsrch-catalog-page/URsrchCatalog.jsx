import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import USearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";
import URFilterSidebar from "../../components/UserComponents/user-rsrch-catalog-comp/URFilterSidebar";
import SimRsrch from "../../components/UserComponents/user-rsrch-catalog-comp/SimRsrch";
import RsrchSearchResults from "../../components/UserComponents/user-rsrch-catalog-comp/RsrchSearchResults";

const URsrchCatalog = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar />
            <Title>Research Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <URFilterSidebar />
                    </div>


                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        <SimRsrch />


                        <RsrchSearchResults />


                    </div>
                </div>
            </main>


        </div>
    )
};

export default URsrchCatalog;