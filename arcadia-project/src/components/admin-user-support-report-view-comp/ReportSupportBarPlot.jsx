"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "/src/supabaseClient.js";

const ReportSupportBarPlot = () => {
  const [data, setData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("day");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const startDate = getStartDate(timeFrame);

    const { data: reports, error: reportError } = await supabase
      .from("report_ticket")
      .select("date, time")
      .gte("date", startDate);

    const { data: supports, error: supportError } = await supabase
      .from("support_ticket")
      .select("date, time")
      .gte("date", startDate);

    if (reportError || supportError) {
      console.error("Error fetching data:", reportError || supportError);
      setIsLoading(false);
      return;
    }

    let groupedData = groupDataByTimeFrame(reports, supports, timeFrame);
    
    // Ensure data is sorted correctly by date
    groupedData = groupedData.sort((a, b) => new Date(a.name) - new Date(b.name));

    setData(groupedData);
    setIsLoading(false);
  }, [timeFrame]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStartDate = (frame) => {
    const now = new Date();
    switch (frame) {
      case "day":
        return now.toISOString().split("T")[0];
      case "week":
        return new Date(now.setDate(now.getDate() - 7)).toISOString().split("T")[0];
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString().split("T")[0];
      default:
        return now.toISOString().split("T")[0];
    }
  };

  const groupDataByTimeFrame = (reports, supports, frame) => {
    const groupedData = {};

    const addToGroup = (item, type) => {
      const key = getGroupKey(item.date, item.time, frame);
      if (!groupedData[key]) groupedData[key] = { name: key, reports: 0, supports: 0 };
      groupedData[key][type]++;
    };

    reports.forEach((report) => addToGroup(report, "reports"));
    supports.forEach((support) => addToGroup(support, "supports"));

    return Object.values(groupedData);
  };

  const getGroupKey = (date, time, frame) => {
    const dateTime = new Date(`${date}T${time}`);
    switch (frame) {
      case "day":
        return dateTime.toLocaleTimeString([], { hour: "2-digit", hour12: false });
      case "week":
        return dateTime.toLocaleDateString([], { weekday: "short" });
      case "month":
        return dateTime.toISOString().split("T")[0]; // Ensure it's sorted properly
      default:
        return dateTime.toLocaleTimeString([], { hour: "2-digit", hour12: false });
    }
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">Reports and Supports Over Time</h3>
      <div className="mb-4">
        <select
          value={timeFrame}
          onChange={(e) => handleTimeFrameChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="reports" fill="#902424" />
          <Bar dataKey="supports" fill="#F5BF03" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportSupportBarPlot;
