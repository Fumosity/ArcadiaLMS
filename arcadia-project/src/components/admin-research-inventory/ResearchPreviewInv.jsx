// File: ResearchPreviewInventory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ResearchPreviewInv = ({ research }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading effect when a research is selected
  useEffect(() => {
    if (research) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [research]);

  // Show a message if no research is selected
  if (!research) {
    return <div className="bg-white p-4 rounded-lg shadow-md">Select a research to see details.</div>;
  }

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <div className="relative bg-white p-2 mb-4 rounded-lg">
          <Skeleton height={200} width={150} className="mx-auto mb-2 rounded" />
          <p className="text-xs text-gray-500 mb-2 text-center">
            <Skeleton width={120} />
          </p>
        </div>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-center">
          <Skeleton width={100} height={35} borderRadius={20} />
        </div>
      </div>
    );
  }

  const researchDetails = {
    title: research.title,
    author: research.author,
    college: research.college,
    department: research.department,
    abstract: research.abstract,
    pages: research.pages,
    keyword: research.keyword,
    pubDate: research.pubDate,
    location: research.location,
    researchID: research.researchID,
    researchARCID: research.researchARCID,
  };

  // Navigate to modify research page with query parameters
  const handleModifyResearch = () => {
    const queryParams = new URLSearchParams(researchDetails).toString();
    navigate(`/admin/researchmodify?${queryParams}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      <h3 className="text-xl font-semibold mb-3">About</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img
          src={research.cover || "image/researchcover.png"}
          alt="Research cover"
          className="h-200 w-150 mx-auto mb-2 rounded border border-grey"
        />
        <p className="text-xs text-gray-500 mb-2 text-center">Research Cover</p>
      </div>

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(researchDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey">
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "45%" }}>
              {key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([a-z]+)([A-Z]{2,})\b/g, (match, p1, p2) => p1 + ' ' + p2).replace(/\b([A-Z]{2,})\b/g, (match) => match.toUpperCase())}
              </td>
              <td className="px-1 py-1 text-sm flex justify-between items-center">
                {(key === "abstract") && value && (
                  <button className="border border-grey px-2 py-0.5 rounded-xl hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
                    View
                  </button>
                )}
                <span>{key === "abstract" ? "" : value || "N/A"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-center">
        <button
          className="px-4 py-2 bg-grey rounded-full border-grey text-sm hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyResearch}
        >
          Modify Research
        </button>
      </div>
    </div>
  );
};

export default ResearchPreviewInv;
