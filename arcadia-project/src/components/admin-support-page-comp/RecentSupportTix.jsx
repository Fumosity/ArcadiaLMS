import React from "react";

const RecentSupportTix = () => {
    const roomRes = [
        { user: "Von Fadri", userID: "1D3", ticketNo: "Ligma Balks" },
        { user: "Von Fadri", userID: "1D3", ticketNo: "Ligma Balks"  },
        { user: "Von Fadri", userID: "1D3", ticketNo: "Ligma Balks"  }
    ];
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Recent Support Tickets</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">User</th>
                        <th className="font-semibold pb-1 border-b border-grey">User ID</th>
                        <th className="font-semibold pb-1 border-b border-grey">Ticket No.</th>
                    </tr>
                </thead>
                <tbody>
                    {roomRes.map((user, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="py-2">{user.user}</td>
                            <td className="py-2">{user.userID}</td>
                            <td className="py-2">{user.ticketNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}
export default RecentSupportTix;