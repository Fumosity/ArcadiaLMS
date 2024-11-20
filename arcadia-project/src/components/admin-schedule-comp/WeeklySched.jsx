import React, { useState } from "react";

export default function WeeklySched() {
    // Weekly schedule data
    const [weeklySchedule] = useState([
        {
            dates: [
                "01 January 2024",
                "02 January 2024",
                "03 January 2024",
                "04 January 2024",
                "05 January 2024",
                "06 January 2024",
                "07 January 2024",
            ],
            slots: [
                { time: "7:00AM-5:00PM", status: "open" },
                { time: "Closed", status: "closed" }, // Example for Saturday and Sunday being closed

            ],
        },
        {
            dates: [
                "08 January 2024",
                "09 January 2024",
                "10 January 2024",
                "11 January 2024",
                "12 January 2024",
                "13 January 2024",
                "14 January 2024",
            ],
            slots: [
                { time: "7:00AM-5:00PM", status: "open" },
                { time: "Closed", status: "closed" },
            ],
        },
        {
            dates: [
                "15 January 2024",
                "16 January 2024",
                "17 January 2024",
                "18 January 2024",
                "19 January 2024",
                "20 January 2024",
                "21 January 2024",
            ],
            slots: [
                { time: "7:00AM-5:00PM", status: "open" },
                { time: "Closed", status: "closed" },
                { time: "7:00AM-12:00PM", status: "" },
            ],
        },
        {
            dates: [
                "22 January 2024",
                "23 January 2024",
                "24 January 2024",
                "25 January 2024",
                "26 January 2024",
                "27 January 2024",
                "28 January 2024",
            ],
            slots: [
                { time: "7:00AM-5:00PM", status: "open" },
                { time: "Closed", status: "closed" },
            ],
        },
    ]);

    const isHalfDate = (date) => {
        const halfDates = [

            "20 January 2024",
        ];
        return halfDates.includes(date);
    };

    const isClosedDate = (date) => {
        const closedDates = [

            "07 January 2024",
            "14 January 2024",
            "21 January 2024",
            "25 January 2024",
            "26 January 2024",
            "27 January 2024",
            "28 January 2024",
        ];
        return closedDates.includes(date);
    };

    return (
        <div className="space-y-8 p-4">
            {/* ARC Weekly Schedule */}
            <div className="aMain-cont overflow-hidden">
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-arcadia-black">
                        ARC Weekly Schedule
                    </h2>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-grey dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Week
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Monday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tuesday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Wednesday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Thursday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Friday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Saturday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sunday
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {weeklySchedule.map((week, weekIndex) => (
                                    <tr key={weekIndex}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                            {weekIndex + 1}
                                        </td>
                                        {week.dates.map((date, dateIndex) => (
                                            <td
                                                key={dateIndex}
                                                className={`px-6 py-4 whitespace-nowrap text-center text-sm ${isClosedDate(date)
                                                    ? "text-black bg-gray-100"
                                                    : "text-black"
                                                    }`}
                                            >
                                                <div className="text-xs mb-1">{date}</div>
                                                {isClosedDate(date) ? (
                                                    <div className="p-2 rounded bg-red text-arcadia-red">
                                                        Closed
                                                    </div>
                                                ) : isHalfDate(date) ? (
                                                    <div className="p-2 rounded bg-pastel-yellow text-yellow">
                                                        {week.slots[0].time}</div> // Half Day message
                                                ) : (
                                                    <div className="bg-green text-dark-green p-2 rounded">
                                                        {week.slots[0].time}
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-500 dark:text-gray-300 max-w-[200px] truncate">
                                            {weekIndex === 2 &&
                                                "Half day on Jan 20 due to an event"}
                                            {weekIndex === 3 &&
                                                "Closed from Jan 25 to Jan 27 for maintenance"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
