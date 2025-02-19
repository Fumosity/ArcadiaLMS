import React, { useState } from 'react';

const BookingForm = () => {
  // Define state for the form inputs
  const [formData, setFormData] = useState({
    userId: '',
    schoolId: '',
    name: '',
    college: '',
    department: '',
    room: '',
    date: '',
    period: '',
    purpose: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Booking</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Left Section */}
        <div className="col-span-2 space-y-3">
          {/* User ID */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">User ID:</label>
            <input 
              type="text" 
              name="userId"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set the width to 2/3 of the container
              value={formData.userId}
              onChange={handleChange}
            />
          </div>

          {/* School ID */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">School ID No.*:</label>
            <input 
              type="text" 
              name="schoolId"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Shortened the width
              value={formData.schoolId}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Name*:</label>
            <input 
              type="text" 
              name="name"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* College */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">College*:</label>
            <input 
              type="text" 
              name="college"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          {/* Department */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Department*:</label>
            <input 
              type="text" 
              name="department"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          {/* Room */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Room:</label>
            <input 
              type="text" 
              name="room"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.room}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Date:</label>
            <input 
              type="text" 
              name="date"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Period */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Period:</label>
            <input 
              type="text" 
              name="period"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.period}
              onChange={handleChange}
            />
          </div>

          {/* Purpose */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 text-sm">Purpose:</label>
            <input 
              type="text" 
              name="purpose"
              className="w-2/3 border border-gray-300 rounded-md p-1 text-sm" // Set width to 2/3
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          {/* Autofilled data note */}
          <p className="text-xs text-gray-500 mt-2">*Autofilled data</p>
        </div>

        {/* Right Section: QR Code */}
        <div className="col-span-1 flex justify-center items-center">
          <div className="border-dashed border-2 border-gray-300 rounded-md p-6 w-full h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <img 
                src="https://via.placeholder.com/100" 
                alt="QR Code Placeholder" 
                className="mb-2"
              />
              <p className="text-gray-600 text-sm">Click to Scan Library Card QR Code</p>
            </div>
          </div>
        </div>
      </div>

            {/* Reserve a Room Button */}
            <div className="flex justify-center mt-6">
                <button className=" text-dark-gray border border-dark-gray px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-200">
                    Reserve a Room
                </button>
            </div>
        </div>
    );
};

export default BookingForm;

