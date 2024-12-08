import React, { useState } from "react";

export default function ARoomBooking({ addReservation }) {
  const [formData, setFormData] = useState({
    room: "A701-A",
    date: "2024-12-07",
    startTime: "09:00",
    endTime: "10:00",
    title: "New Reservation",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    const newEvent = {
      id: String(Date.now()), // Unique ID
      resourceId: formData.room,
      title: formData.title,
      start: `${formData.date}T${formData.startTime}`,
      end: `${formData.date}T${formData.endTime}`,
    };

    addReservation(newEvent);
  };

  return (
    <div className="bg-white overflow-hidden border border-grey mb-8 p-6 rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-2">Booking</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-dark-gray">Room:</span>
          <select
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            className="input-space"
          >
            <option value="A701-A">Discussion Room 1 (A701-A)</option>
            <option value="A701-B">Discussion Room 2 (A701-B)</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-dark-gray">Date:</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="input-space"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-dark-gray">Start Time:</span>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className="input-space"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-dark-gray">End Time:</span>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className="input-space"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-dark-gray">Title:</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input-space"
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button className="reservButton" onClick={handleFormSubmit}>
          Reserve a Room
        </button>
      </div>
    </div>
  );
}
