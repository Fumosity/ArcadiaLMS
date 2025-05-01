import React, { useEffect, useState } from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import ReturnToSearch from "../../components/UserComponents/user-book-view-comp/ReturnToSearch";
import RsrchAvailability from "../../components/UserComponents/user-rsrch-view-comp/RsrchAvailability";
import RsrchInformation from "../../components/UserComponents/user-rsrch-view-comp/RsrchInformation";
import SimRsrch from "../../components/UserComponents/user-rsrch-catalog-comp/SimRsrch";
import { supabase } from "./../../supabaseClient"; // Adjust path if necessary
import { useLocation } from "react-router-dom";  // To read URL params
import Pathfinder from "../../components/UserComponents/pathfinder-comp/Pathfinder";

const URsrchView = () => {
  useEffect(() => {
    document.title = "Arcadia | Research View";
}, []);
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
          let currentLocation = "2nd Floor, Circulation Section";

          data.location = currentLocation

          setResearch(data);
          setLoading(false)
        }

        console.log(research)
      } else {
        setError("Title ID not provided")
        setLoading(false)
        return
      }
    };
    fetchResearchDetails();
  }, [researchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-white flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading research details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-white flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>Research View</Title>

      <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
        <div className="lg:w-1/4 lg:block mb-4 space-y-4 sticky top-5 self-start">
          <RsrchAvailability research={research} />
        </div>
        <div className="userMain-content lg:w-3/4 md:w-full">
          <ReturnToSearch research={research} />
          <RsrchInformation research={research} />
          <Pathfinder book={research} />
          <SimRsrch research={research} />
        </div>
      </div>
    </div>
  );
}

export default URsrchView;
