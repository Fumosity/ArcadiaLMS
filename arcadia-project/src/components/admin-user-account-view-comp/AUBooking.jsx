import React, { useState } from "react";

const AUBooking = () => {
  const [type, setType] = useState("Admin");
  const [userId, setUserId] = useState("1-00923");
  const [schoolId, setSchoolId] = useState("2021-2-01090");
  const [name, setName] = useState("Alexander B. Corrine");
  const [college, setCollege] = useState("COECSA");
  const [department, setDepartment] = useState("DCS");
  const [email, setEmail] = useState("a.corrine@lpunetwork.edu.ph");

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Booking</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Left side for input fields */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">Type:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">User ID:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">School ID No.:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">Name:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">College:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">Department:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-base font-medium">Email:</label>
            <input
              className="border border-grey rounded-lg px-3 py-1 w-64"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Right side for image */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-left w-full">Library Card:</p>
          <div className="w-full h-64 flex justify-center items-center border border-grey rounded-lg">
            <img className="w-16 h-16" src="https://via.placeholder.com/64x64" alt="Library Card" />
          </div>
        </div>
      </div>

      {/* Buttons section at the bottom */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="px-6 py-2 bg-gray-200 rounded-full border border-grey">Modify</button>
        <button className="px-6 py-2 bg-gray-200 rounded-full border border-grey">Delete</button>
        <button className="px-6 py-2 bg-gray-200 rounded-full border border-grey">Blacklist</button>
        <button className="px-6 py-2 bg-gray-200 rounded-full border border-grey">Whitelist</button>
      </div>
    </>
  );
};

export default AUBooking;
