import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";

export default function CollegeList({ onCollegeSelect, colleges }) {
  const handleRowClick = (college) => {
    onCollegeSelect(college);
  };

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
      <h3 className="text-2xl font-semibold mb-4">List of Colleges</h3>
      <div className="max-h-96 overflow-y-auto border border-x-0 border-dark-gray custom-scrollbar">
        {colleges.length === 0 ? (
          <p>No colleges available.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abbreviation
                </th>
                <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {colleges.map((college) => (
                <tr
                  key={college.collegeAbbrev}
                  className="hover:bg-light-gray cursor-pointer border-b border-grey"
                  onClick={() => handleRowClick(college)}
                >
                  <td className="w-1/3 px-4 py-2 text-center text-sm">{college.collegeAbbrev}</td>
                  <td className="w-2/3 px-4 py-2 text-sm">{college.collegeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

