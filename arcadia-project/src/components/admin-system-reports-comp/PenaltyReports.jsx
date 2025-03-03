import React, { useState } from "react";

function PenaltyReports({ exportData }) {
    const [damages, setDamages] = useState("");
    const [overdue, setOverdue] = useState("");
    const [total, setTotal] = useState("");

    const handleInputChange = (e, setValue) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setValue(value ? `₱${value}` : "");
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <h3 className="text-2xl font-semibold mb-4">Summary of Outstanding Fines</h3>
            <p className="text-sm text-gray-600 mb-4">
                Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
            </p>


            <div className="flex">
                <div className="space-y-2 w-2/3">
                    <div className="flex items-center">
                        <span className="w-2/5 text-md font-medium">Unpaid Damages:</span>
                        <input
                            type="text"
                            value={damages}
                            onChange={(e) => handleInputChange(e, setDamages)}
                            placeholder="Enter Fee"
                            className={`px-3 py-1 rounded-full border border-grey w-full`} // Input width: 3/5 of 2/3, otherwise w-full
                            />
                    </div>
                    <div className="flex items-center">
                        <span className="w-2/5 text-md font-medium">Overdue Books:</span>
                        <input
                            type="text"
                            value={overdue}
                            onChange={(e) => handleInputChange(e, setOverdue)}
                            placeholder="Enter Fee"
                            className={`px-3 py-1 rounded-full border border-grey w-full`} // Input width: 3/5 of 2/3, otherwise w-full
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-2/5 text-md font-medium">Total Fines Incurred:</span>
                        <input
                            type="text"
                            value={total}
                            onChange={(e) => handleInputChange(e, setTotal)}
                            placeholder="Enter Fee"
                            className={`px-3 py-1 rounded-full border border-grey w-full`} // Input width: 3/5 of 2/3, otherwise w-full
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-1/3">
                    <button
                        className="add-book w-2/3 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        onClick={() => console.log(exportData)}
                    >
                        Export as XLSX
                    </button>
                    <button
                        className="add-book w-2/3 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        onClick={() => console.log(exportData)}
                    >
                        Export as CSV
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PenaltyReports;
