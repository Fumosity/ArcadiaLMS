import React, { useState } from "react";

function PenaltyReports() {
    const [weeklyDamages, setWeeklyDamages] = useState("");
    const [weeklyOverdue, setWeeklyOverdue] = useState("");
    const [weeklyTotal, setWeeklyTotal] = useState("");

    const [monthlyDamages, setMonthlyDamages] = useState("");
    const [monthlyOverdue, setMonthlyOverdue] = useState("");
    const [monthlyTotal, setMonthlyTotal] = useState("");

    const handleInputChange = (e, setValue) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setValue(value ? `₱${value}` : "");
    };

    return (
        <div className="aMain-cont">
            <h2 className="text-xl font-semibold mb-2">Penalty Reports</h2>
            <p className="text-sm text-gray-600 mb-4">
                Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
            </p>

            {/* Reports Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Previous Week */}
                <div>
                    <h3 className="font-semibold mb-2">Previous Week (Jan 1 - Jan 7)</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Damages:</span>
                            <input
                                type="text"
                                value={weeklyDamages}
                                onChange={(e) => handleInputChange(e, setWeeklyDamages)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Overdue Books:</span>
                            <input
                                type="text"
                                value={weeklyOverdue}
                                onChange={(e) => handleInputChange(e, setWeeklyOverdue)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Total Fines Incurred:</span>
                            <input
                                type="text"
                                value={weeklyTotal}
                                onChange={(e) => handleInputChange(e, setWeeklyTotal)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button className="penBtn">Print a Weekly Report</button>
                    </div>
                </div>

                {/* Previous Month */}
                <div>
                    <h3 className="font-semibold mb-2">Previous Month (December 2023)</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Damages:</span>
                            <input
                                type="text"
                                value={monthlyDamages}
                                onChange={(e) => handleInputChange(e, setMonthlyDamages)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Overdue Books:</span>
                            <input
                                type="text"
                                value={monthlyOverdue}
                                onChange={(e) => handleInputChange(e, setMonthlyOverdue)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-40 text-sm font-medium">Total Fines Incurred:</span>
                            <input
                                type="text"
                                value={monthlyTotal}
                                onChange={(e) => handleInputChange(e, setMonthlyTotal)}
                                placeholder="Enter Fee"
                                className="input-bar"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button className="penBtn">Print a Monthly Report</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PenaltyReports;
