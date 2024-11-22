import React from "react";

const SBFines = () => {
    const outstandingFines = [
        { user: "Von Fadri", totalFine: "₱123"},
        { user: "Jane Doe", totalFine: "₱200"},
        { user: "John Smith", totalFine: "₱500"},
    ];

    return (
        <div className="uSidebar-cont">
            <h3 className="text-xl font-semibold mb-4">Outstanding Fines</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibol text-center pb-1 border-b border-grey">User</th>
                        <th className="font-semibold text-center pb-1 border-b border-grey">Total Fine</th>
                    </tr>
                </thead>
                <tbody>
                    {outstandingFines.map((user, index) => (
                        <tr key={index} className="border-t items-center text-center border-grey">
                            <td className="py-2">{user.user}</td>
                            <td className="py-2">{user.totalFine}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SBFines;
