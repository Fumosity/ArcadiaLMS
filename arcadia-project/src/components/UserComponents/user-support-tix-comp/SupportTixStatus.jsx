import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SupportTixStatus = () => {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userID, setUserID] = useState(null);

    // Retrieve user_ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.userID) {
            setUserID(user.userID);
        } else {
            alert("User not logged in. Please log in to view your tickets.");
        }
    }, []);

    // Fetch reports function
    const fetchReports = async () => {
        if (!userID) return;

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("support_ticket")
                .select("ticketID, type, status, subject, date, time")
                .eq("userID", userID); // Filter by user_ID

            if (error) throw error;

            setReportData(data || []);
        } catch (error) {
            console.error("Error fetching reports:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch reports when the component mounts
    useEffect(() => {
        fetchReports();
    }, [userID]);

    return (
        <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Support Ticket Status</h2>
                <button
                    className="modifyButton"
                    onClick={fetchReports}
                >
                    Refresh
                </button>
            </div>
            <p className="text-sm mb-4">
                These are all the user reports that you have made. Click on the report ID to view the contents of the report and the ARC's reply.
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full text-center">
                    <thead className="border-b border-grey text-center">
                        <tr>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Type</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Time</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500">Report ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td><Skeleton height={20} /></td>
                                    <td><Skeleton height={20} /></td>
                                    <td><Skeleton height={20} /></td>
                                    <td><Skeleton height={20} /></td>
                                    <td><Skeleton height={20} /></td>
                                    <td><Skeleton height={20} /></td>
                                </tr>
                            ))
                        ) : reportData.length > 0 ? (
                            reportData.map((report) => (
                                <tr key={report.ticketID}>
                                    <td className="px-4 py-2 text-sm">
                                        <div className="text-center border rounded-xl text-arcadia-red">
                                            {report.type || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-semibold ${
                                                report.status === "Ongoing"
                                                    ? "bg-yellow"
                                                    : report.status === "Resolved"
                                                    ? "bg-green"
                                                    : report.status === "Intended"
                                                    ? "bg-red"
                                                    : ""
                                            }`}
                                        >
                                            {report.status || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm">{report.subject || "N/A"}</td>
                                    <td className="px-4 py-2 text-sm">{report.date || "N/A"}</td>
                                    <td className="px-4 py-2 text-sm">{report.time || "N/A"}</td>
                                    <td className="px-4 py-2 text-sm text-red-600 font-medium hover:underline cursor-pointer">
                                        {report.ticketID || "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 py-4">
                                    No reports found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportTixStatus;
