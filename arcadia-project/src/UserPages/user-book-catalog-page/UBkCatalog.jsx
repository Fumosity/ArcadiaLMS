import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import USearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";
import FilterSidebar from "../../components/UserComponents/user-book-catalog-comp/FilterSidebar";
import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";
import BkSearchResults from "../../components/UserComponents/user-book-catalog-comp/BkSearchResults";


const UBkCatalog = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar />
            <Title>Book Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Content Container */}
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    {/* Sidebar */}
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <FilterSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {/* Hero Section */}
                        <SimBooks />

                        {/* News and Updates */}
                        <BkSearchResults />

                    </div>
                </div>
            </main>


        </div>
    )
};

export default UBkCatalog;