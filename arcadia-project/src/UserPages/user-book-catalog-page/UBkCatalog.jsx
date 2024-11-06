import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import USearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk";
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk";
import FilterSidebar from "../../components/UserComponents/user-book-catalog-comp/FilterSidebar";
import Recommended from "../../components/UserComponents/user-home-comp/Recommended";
import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";
import BkSearchResults from "../../components/UserComponents/user-book-catalog-comp/BkSearchResults";


const UBkCatalog = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar />
            <Title>Book Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex py-8 px-4 gap-8">
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4">
                        <FilterSidebar />
                    </div>

                    <div className="userMain-content w-3/4">
                        <SimBooks />
                        
                        <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4">
                            <BkSearchResults />
                        </div>

                    </div>
                </div>
            </main>


        </div>
    )
};

export default UBkCatalog;