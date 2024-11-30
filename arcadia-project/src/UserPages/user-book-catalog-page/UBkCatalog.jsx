import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import USearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";
import FilterSidebar from "../../components/UserComponents/user-book-search-comp/FilterSidebar";
import Recommended from "../../components/UserComponents/user-home-comp/Recommended";
import MostPopular from "../../components/UserComponents/user-home-comp/MostPopular";
import HighlyRated from "../../components/UserComponents/user-home-comp/HighlyRated";
import NewlyAdded from "../../components/UserComponents/user-book-catalog-comp/NewlyAdded";
import ReleasedThisYear from "../../components/UserComponents/user-book-catalog-comp/ReleasedThisYear";
import Fiction from "../../components/UserComponents/user-book-catalog-comp/Fiction";
import Nonfiction from "../../components/UserComponents/user-book-catalog-comp/Nonfiction";


const UBkCatalog = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar />
            <Title>Book Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <FilterSidebar />
                    </div>

                    
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        
                        <Recommended />
                        <MostPopular />
                        <HighlyRated />
                        <NewlyAdded />
                        <ReleasedThisYear />
                        <Fiction />
                        <Nonfiction />
                    </div>
                </div>
            </main>
        </div>
    )
};

export default UBkCatalog;