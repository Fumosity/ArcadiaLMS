import React, { useState } from "react";

export default function CalendarEvents() {
  // Weekly schedule data
  const [weeklySchedule] = useState([
    {
      dates: [
        "01 January 2024",
        "02 January 2024",
        "03 January 2024",
        "04 January 2024",
        "05 January 2024",
        "06 January 2024",
        "07 January 2024",
      ],
      slots: [{ time: "7:00AM-5:00PM", status: "open" }],
    },
    {
      dates: [
        "08 January 2024",
        "09 January 2024",
        "10 January 2024",
        "11 January 2024",
        "12 January 2024",
        "13 January 2024",
        "14 January 2024",
      ],
      slots: [{ time: "7:00AM-5:00PM", status: "open" }],
    },
    {
      dates: [
        "15 January 2024",
        "16 January 2024",
        "17 January 2024",
        "18 January 2024",
        "19 January 2024",
        "20 January 2024",
        "21 January 2024",
      ],
      slots: [{ time: "7:00AM-5:00PM", status: "open" }],
    },
    {
      dates: [
        "22 January 2024",
        "23 January 2024",
        "24 January 2024",
        "25 January 2024",
        "26 January 2024",
        "27 January 2024",
        "28 January 2024",
      ],
      slots: [{ time: "7:00AM-5:00PM", status: "open" }],
    },
  ]);

  // Calendar events data
  const [events] = useState([
    { date: "08 January 2024", event: "Final Exams" },
    { date: "09 January 2024", event: "Final Exams" },
    { date: "10 January 2024", event: "Final Exams" },
    { date: "11 January 2024", event: "Final Exams" },
    { date: "12 January 2024", event: "Final Exams" },
    { date: "13 January 2024", event: "Final Exams" },
    { date: "15 January 2024", event: "Semestral Break" },
    { date: "16 January 2024", event: "Semestral Break" },
    { date: "17 January 2024", event: "Semestral Break" },
    { date: "18 January 2024", event: "Semestral Break" },
    { date: "19 January 2024", event: "Semestral Break" },
    { date: "20 January 2024", event: "Semestral Break" },
    { date: "22 January 2024", event: "Semestral Break" },
    { date: "23 January 2024", event: "Semestral Break" },
    { date: "24 January 2024", event: "Semestral Break" },
    { date: "25 January 2024", event: "Semestral Break" },
    { date: "26 January 2024", event: "Semestral Break" },
    { date: "27 January 2024", event: "Semestral Break" },
  ]);

  return (
    <div className="space-y-8 p-4">
      <div className="aMain-cont overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-arcadia-black">
            Calendar Events
          </h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-grey dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Week", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Notes"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {weeklySchedule.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {weekIndex + 1}
                    </td>
                    {week.dates.map((date, dateIndex) => {
                      const event = events.find((e) => e.date === date);
                      return (
                        <td
                          key={dateIndex}
                          className="px-6 py-4 whitespace-nowrap text-center text-sm text-black"
                        >
                          <div className="text-xs mb-1">{date}</div>
                          {event && (
                            <div
                              className={`${
                                event.event === "Final Exams"
                                  ? "bg-red text-arcadia-red"
                                  : "bg-pastel-yellow text-yellow"
                              } p-2 rounded`}
                            >
                              {event.event}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm flex justify-center space-x-2">
            <button className="schedBtn">Add Event</button>
            <button className="schedBtn">Modify Event</button>
            <button className="schedBtn">Remove Event</button>
          </div>
        </div>
      </div>
    </div>
  );
}
