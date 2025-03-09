import React, { useState, useEffect } from "react";
import ExcellentExport from "excellentexport";

function PenaltyReports({ exportData }) {
    const [damages, setDamages] = useState("");
    const [overdue, setOverdue] = useState("");
    const [total, setTotal] = useState("");

    useEffect(() => {
        if (exportData) {
            const overdueTotal = exportData.bkhistoryData.reduce((sum, entry) => sum + entry.fine_amount, 0);
            const damageTotal = exportData.damageFinesData.reduce((sum, entry) => sum + entry.fine, 0);
            const totalFines = overdueTotal + damageTotal;

            setOverdue(`₱${overdueTotal.toLocaleString()}`);
            setDamages(`₱${damageTotal.toLocaleString()}`);
            setTotal(`₱${totalFines.toLocaleString()}`);
        }
    }, [exportData]);

    const formatSchoolNo = (value) => {
        let numericValue = value.replace(/\D/g, "");
        if (numericValue.length > 4) numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
        if (numericValue.length > 6) numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`;
        return numericValue;
    };

    const exportAsXLSX = () => {
        const table = document.createElement("table");

        // Add headers
        const headerRow = table.insertRow();
        const headers = ["User Name", "School ID", "Fine Type", "Fine Amount"];
        headers.forEach(header => {
            const cell = headerRow.insertCell();
            cell.textContent = header;
        });

        // Add overdue fines
        exportData.bkhistoryData.forEach(entry => {
            const row = table.insertRow();
            row.insertCell().textContent = entry.user_name;
            row.insertCell().textContent = formatSchoolNo(entry.school_id);
            row.insertCell().textContent = "Overdue";
            row.insertCell().textContent = `${entry.total_fine}`;
        });

        // Add damage fines
        exportData.damageFinesData.forEach(entry => {
            const row = table.insertRow();
            row.insertCell().textContent = entry.user_name;
            row.insertCell().textContent = formatSchoolNo(entry.school_id);
            row.insertCell().textContent = "Damages";
            row.insertCell().textContent = `${entry.fine}`;
        });

        // Trigger file download using hidden <a> tag
        const link = document.getElementById("xlsxDownload");
        ExcellentExport.convert(
            { anchor: link, filename: "PenaltyReports", format: "xlsx" },
            [{ name: "Fines Report", from: { table } }]
        );
        link.click();
    };

    const exportAsCSV = () => {
        const data = [["User Name", "School ID", "Fine Type", "Fine Amount"]];

        // Add overdue fines
        exportData.bkhistoryData.forEach(entry => {
            data.push([entry.user_name, formatSchoolNo(entry.school_id), "Overdue", `${entry.total_fine}`]);
        });

        // Add damage fines
        exportData.damageFinesData.forEach(entry => {
            data.push([entry.user_name, formatSchoolNo(entry.school_id), "Damages", `${entry.fine}`]);
        });

        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "PenaltyReports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <input type="text" value={damages} readOnly className="px-3 py-1 rounded-full border border-grey w-full" />
                    </div>
                    <div className="flex items-center">
                        <span className="w-2/5 text-md font-medium">Overdue Books:</span>
                        <input type="text" value={overdue} readOnly className="px-3 py-1 rounded-full border border-grey w-full" />
                    </div>
                    <div className="flex items-center">
                        <span className="w-2/5 text-md font-medium">Total Fines Incurred:</span>
                        <input type="text" value={total} readOnly className="px-3 py-1 rounded-full border border-grey w-full" />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-1/3">
                    <button className="add-book w-2/3 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition" onClick={exportAsXLSX}>
                        Export as XLSX
                    </button>
                    <button className="add-book w-2/3 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition" onClick={exportAsCSV}>
                        Export as CSV
                    </button>
                </div>
            </div>

            {/* Hidden <a> tag for XLSX export */}
            <a id="xlsxDownload" style={{ display: "none" }} href="/">Download</a>
        </div>
    );
}

export default PenaltyReports;
