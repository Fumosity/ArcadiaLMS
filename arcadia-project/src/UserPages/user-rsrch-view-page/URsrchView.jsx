import React, { useEffect, useState } from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import ReturnToSearch from "../../components/UserComponents/user-book-view-comp/ReturnToSearch";
import RsrchAvailability from "../../components/UserComponents/user-rsrch-view-comp/RsrchAvailability";
import RsrchInformation from "../../components/UserComponents/user-rsrch-view-comp/RsrchInformation";
import SimRsrch from "../../components/UserComponents/user-rsrch-catalog-comp/SimRsrch";
import { supabase } from "./../../supabaseClient"; // Adjust path if necessary
import { useLocation } from "react-router-dom";  // To read URL params

const URsrchView = () => {
  const [research, setResearch] = useState(null);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const researchId = queryParams.get("researchID");

  useEffect(() => {
    const fetchResearchDetails = async () => {
      if (researchId && !isNaN(researchId)) {
        const { data, error } = await supabase
          .from("research")
          .select("*")
          .eq("researchID", researchId)
          .single();

        if (error) {
          console.error("Error fetching research:", error);
        } else {
          setResearch(data);
        }
        console.log(research)
      } else {
        console.error("Invalid or missing researchId");
      }
    };
    fetchResearchDetails();
  }, [researchId]);

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>Research View</Title>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4 mr-5">
            <RsrchAvailability />
          </div>
          <div className="userMain-content lg:w-3/4 w-full mt-4 ml-5">
            <ReturnToSearch />
            <RsrchInformation research={research} />
            <SimRsrch research={research} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default URsrchView;
