import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LibraryAnalyticsChart = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Library Analytics</h3>
        <button
          className="text-arcadia-red text-sm flex items-center"
          onClick={() => navigate('/analytics')} // Navigate to Library Analytics page
        >
          See more <FiChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Library Analytics Chart Placeholder</span>
      </div>
    </div>
  );
};

export default LibraryAnalyticsChart;
