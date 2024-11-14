import React from "react";

const RecentSupport = () => {
    const recentUserReports = [
        { user: "Von Fadri", userID: "1D3", reportID: "R001" },
        { user: "Jane Doe", userID: "2D4", reportID: "R002" },
        { user: "John Smith", userID: "3D5", reportID: "R003" }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Recent Support Tickets</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">User</th>
                        <th className="font-semibold pb-1 border-b border-grey">User ID</th>
                        <th className="font-semibold pb-1 border-b border-grey">Report ID</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUserReports.map((user, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="py-2">{user.user}</td>
                            <td className="py-2">{user.userID}</td>
                            <td className="py-2">{user.reportID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentSupport;
