import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Import the CSS for the calendar

const UpEvents = () => {
  const [date, setDate] = useState(new Date());
  const events = [
    { title: "Midterm Exams", dateRange: "Nov. 5th - Nov. 12th" },
    { title: "ARC Week", dateRange: "Nov. 15th - Nov. 21st" },
    { title: "TOEIC Certification", dateRange: "Dec. 3 - Dec. 5" },
  ];

  return (
    <div className="uSidebar-cont">
      <h2 className="text-xl font-semibold mb-2.5">Upcoming Events</h2>
      {/* Calendar Component */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <Calendar
          onChange={setDate}
          value={date}
          className="mx-auto"
          tileClassName={({ date, view }) =>
            view === "month" && (date.getDay() === 0 ? "text-red-500" : "")
          }
        />
      </div>
      
      {/* Events List */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left py-2">Event</th>
            <th className="text-right py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-t border-grey">
              <td className="py-2">{event.title}</td>
              <td className="py-2 text-right">{event.dateRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpEvents;
