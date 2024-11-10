import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Recommended from "../../components/UserComponents/user-home-comp/Recommended";
import USearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk";
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk";
import LatestNewsUpd from "../../components/UserComponents/user-news-n-updates-comp/LatestNewsUpd";
import Title from "../../components/main-comp/Title";
import ExpandedReco from "../../components/UserComponents/user-reco-comp/ExpandedReco";
import ExpandedMostPop from "../../components/UserComponents/user-most-popular-comp/ExpandedMostPop";
import ExpandedHighRate from "../../components/UserComponents/user-high-rate-comp/ExpandedHighRate";
import BookAvailability from "../../components/UserComponents/user-book-view-comp/BookAvailability";
import ReturnToSearch from "../../components/UserComponents/user-book-view-comp/ReturnToSearch";
import BookInformation from "../../components/UserComponents/user-book-view-comp/BookInformation";
import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";

const UBookView = () => {
  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <USearchBar />
      <Title>Book View</Title>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Sidebar */}
          <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4 mr-5">
            <BookAvailability />
          </div>

          {/* Main Content */}
          <div className="userMain-content lg:w-3/4 w-full mt-4 ml-5">
            {/* Hero Section */}
            <ReturnToSearch />
            <BookInformation />
            
            <SimBooks />

          </div>
        </div>
      </main>
    </div>
  );
}

export default UBookView;
