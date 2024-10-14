import React from "react";


const UserReports = () => {
    const dataUserReports = [
        { user: "Keith Thurman", userID: "321", reportID: "435" },
        { user: "Keith Thurman", userID: "321", reportID: "435" },
        { user: "Keith Thurman", userID: "321", reportID: "435" }
    ]

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Recent User Reports</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">User</th>
                        <th className="font-semibold pb-1 border-b border-grey">User ID</th>
                        <th className="font-semibold pb-1 border-b border-grey">Report ID</th>
                    </tr>
                </thead>
                <tbody>
                    {dataUserReports.map((user, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="py-2">{user.user}</td>
                            <td className="py-2">{user.userID}</td>
                            <td className="py-2">{user.reportID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};
export default UserReports;