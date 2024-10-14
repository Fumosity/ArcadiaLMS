import React from "react";

const TodayReserv = () => {
    const roomRes = [
        { room: "Von Fadri", time: "1D3", booker: "Ligma Balks" },
        { room: "Von Fadri", time: "1D3", booker: "Ligma Balks"  },
        { room: "Von Fadri", time: "1D3", booker: "Ligma Balks"  }
    ];
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Most Popular Books</h3>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="font-semibold pb-1 border-b border-grey">Room</th>
                        <th className="font-semibold pb-1 border-b border-grey">Time</th>
                        <th className="font-semibold pb-1 border-b border-grey">Booker</th>
                    </tr>
                </thead>
                <tbody>
                    {roomRes.map((room, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="py-2">{room.room}</td>
                            <td className="py-2">{room.time}</td>
                            <td className="py-2">{room.booker}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}
export default TodayReserv;