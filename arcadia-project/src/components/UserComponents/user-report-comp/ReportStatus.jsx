import React from "react";

const ReportStatus = () => {
    const reportData = [
        { type: "System", status: "Ongoing", subject: "Bugs on the Home Page", date: "Sept. 21, 2024", time: "12:42:12PM", reportID: "456" },
        { type: "Book", status: "Resolved", subject: "Incorrect Book Cover", date: "Sept. 21, 2024", time: "12:42:12PM", reportID: "456" },
        { type: "Research", status: "Intended", subject: "Spelling error in abstract", date: "Sept. 21, 2024", time: "12:42:12PM", reportID: "456" },
    ];

    return (
        <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">
            {/* User Report Status Section */}
            <h2 className="text-lg font-semibold mb-4">User Report Status</h2>
            <p className="text-sm mb-4">
                These are all the user reports that you have made. Click on the report ID to view the contents of the report and the ARC's reply.
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full text-center">
                    <thead className=" border-b border-grey text-center">
                        <tr className="">
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Type</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Time</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Report ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {reportData.map((report, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 text-sm">
                                    <div className="text-center text-a-t-red border border-a-t-red rounded-xl">{report.type}</div>
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    <span
                                        className={`px-4 py-1 rounded-full text-xs font-semibold ${report.status === "Ongoing"
                                                ? "bg-green text-green-800"
                                                : report.status === "Resolved"
                                                    ? "bg-arcadia-yellow text-yellow-800"
                                                    : "bg-red text-red-800"
                                            }`}
                                    >
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-sm">{report.subject}</td>
                                <td className="px-4 py-2 text-sm">{report.date}</td>
                                <td className="px-4 py-2 text-sm">{report.time}</td>
                                <td className="px-4 py-2 text-sm text-arcadia-red font-medium hover:underline cursor-pointer">
                                    {report.reportID}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Make a Report Section */}
            
        </div>
    );
};

export default ReportStatus;
