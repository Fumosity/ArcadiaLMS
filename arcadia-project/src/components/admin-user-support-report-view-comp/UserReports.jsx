import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { Link } from "react-router-dom"; // Import Link to navigate
import Skeleton from "react-loading-skeleton"; 
import "react-loading-skeleton/dist/skeleton.css";

const TableRow = ({ type, status, subject, date, time, reportID, reportDetails }) => {
  const statusColor =
    status === "Resolved" ? "bg-green" :
    status === "Ongoing" ? "bg-yellow" :
    status === "Intended" ? "bg-red" : "bg-grey";

  return (
    <Link
      to="/admin/reportticket" // Update the link to navigate to ReportView
      state={{ ticket: reportDetails }} // Pass the selected report data to the ReportView via state
      className="w-full grid grid-cols-6 gap-4 items-center text-center text-sm text-gray-900 mb-2 cursor-pointer hover:bg-gray-100"
    >
      <div className="border rounded-full py-1 px-3">{type || "Not Available"}</div>
      <div className={`py-1 px-3 rounded-full ${statusColor}`}>
        {status || "Not Available"}
      </div>
      <div className="truncate max-w-xs">{subject || "Not Available"}</div>
      <div>{date || "Not Available"}</div>
      <div>{time || "Not Available"}</div>
      <div>{reportID || "Not Available"}</div>
    </Link>
  );
};

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("report_ticket")
          .select("report_id, type, status, subject, date, time, content");

        if (error) throw error;

        setReports(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-zinc-900 text-xl font-semibold">User Reports</h2>
      </div>

      <div className="w-full grid grid-cols-6 gap-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        <div>Type</div>
        <div>Status</div>
        <div>Subject</div>
        <div>Date</div>
        <div>Time</div>
        <div>Report ID</div>
      </div>
      <div className="w-full border-t border-grey mb-2"></div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={20} />
          ))}
        </div>
      ) : reports.length > 0 ? (
        reports.map(report => (
          <React.Fragment key={report.report_id}>
            <TableRow
              type={report.type}
              status={report.status}
              subject={report.subject}
              date={report.date}
              time={report.time}
              reportID={report.report_id}
              reportDetails={report} // Pass the entire report data
            />
            <div className="w-full border-t border-grey mb-2"></div>
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-500">No reports found</div>
      )}
    </>
  );
};

export default UserReports;
