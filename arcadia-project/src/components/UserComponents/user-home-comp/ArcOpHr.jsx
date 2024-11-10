import React from "react";

const ArcOpHr = () => {
  const hours = [
    { day: "Monday", time: "7:00 AM - 5:00 PM" },
    { day: "Tuesday", time: "7:00 AM - 5:00 PM" },
    { day: "Wednesday", time: "7:00 AM - 5:00 PM" },
    { day: "Thursday", time: "7:00 AM - 5:00 PM" },
    { day: "Friday", time: "7:00 AM - 5:00 PM" },
    { day: "Saturday", time: "7:00 AM - 5:00 PM" },
    { day: "Sunday", time: "Closed" },
  ];

  return (
    <div className="uSidebar-cont">
      <h2 className="text-xl font-semibold mb-2.5">ARC Operating Hours</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left py-2">Day</th>
            <th className="text-right py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, index) => (
            <tr key={index} className="border-t border-grey">
              <td className="py-2">{hour.day}</td>
              <td className={`py-2 text-right ${hour.time === "Closed" ? "text-red-600" : "text-gray-800"}`}>
                {hour.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArcOpHr;
