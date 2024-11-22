import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RemoveEvent({ isOpen, onClose }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [eventName, setEventName] = useState(""); // Added state for event name
  const [startDate, endDate] = dateRange;

  if (!isOpen) return null;

  const CustomInput = ({ value, onClick }) => (
    <button
      className="inputBox text-left px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:border-black focus:border-black"
      onClick={onClick}
    >
      {value || "Select date range"}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-semibold mb-4 text-left">Remove Calendar Events</h2>

        <div className="space-y-4">
          {/* Date Range Input */}
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Date Range:</span>
            <div className="flex-1 flex justify-end">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                customInput={<CustomInput />}
                className="inputBox"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Event Name:</span>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter Event Name"
              className="inputBox flex-1 px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:border-black"
            />
          </div>
        </div>


        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="modifyButton"
            onClick={() => {
              // Palagay na lang ng remove logic boss
              onClose();
            }}
          >
            Remove
          </button>
          <button
            className="cancelButton"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
