import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const ArcOpHr = () => {
  const [regularHours, setRegularHours] = useState([]);
  const [holidayHours, setHolidayHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingHoliday, setUpcomingHoliday] = useState(null);

  useEffect(() => {
    async function fetchHours() {
      try {
        // Fetch regular hours
        const { data: regularData, error: regularError } = await supabase
          .from("operating_hours")
          .select("*")
          .order("dayOrder");

        if (regularError) throw regularError;
        setRegularHours(regularData || []);

        // Fetch upcoming holiday hours (next 30 days)
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        const { data: holidayData, error: holidayError } = await supabase
          .from("holiday_hours")
          .select("*")
          .gte('date', today.toISOString().split('T')[0])
          .lte('date', thirtyDaysLater.toISOString().split('T')[0])
          .order('date');

        if (holidayError) throw holidayError;
        
        if (holidayData && holidayData.length > 0) {
          setHolidayHours(holidayData);
          setUpcomingHoliday(holidayData[0]); // Set the nearest upcoming holiday
        }
      } catch (error) {
        console.error("Error fetching hours:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHours();
  }, []);

  function formatTime(time) {
    if (!time) return null;

    // Convert from 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  }

  if (loading) {
    return <div className="uSidebar-filter">Loading hours...</div>;
  }

  return (
    <div className="uSidebar-filter">
      <h2 className="text-xl font-semibold mb-2.5">ARC Operating Hours</h2>
      
      {/* Show upcoming holiday notice if there is one */}
      {upcomingHoliday && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="font-medium">{upcomingHoliday.holiday_name} - {formatDate(upcomingHoliday.date)}</p>
          <p className={upcomingHoliday.isClosed ? "text-red-600" : ""}>
            {upcomingHoliday.isClosed 
              ? "Closed" 
              : `${formatTime(upcomingHoliday.opensAt)} - ${formatTime(upcomingHoliday.closesAt)}`}
          </p>
        </div>
      )}
      
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left py-2">Day</th>
            <th className="text-right py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {regularHours.map((hour, index) => (
            <tr key={index} className="border-t border-grey">
              <td className="py-2">{hour.day}</td>
              <td className={`py-2 text-right ${hour.isClosed ? "text-red-600" : "text-gray-800"}`}>
                {hour.isClosed ? "Closed" : `${formatTime(hour.opensAt)} - ${formatTime(hour.closesAt)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArcOpHr;