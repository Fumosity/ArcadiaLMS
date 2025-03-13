import React, { useState } from "react";

export default function CollegeAndDept() {
    const [selectedCollege, setSelectedCollege] = useState("COECSA");
    const [selectedDept, setSelectedDept] = useState("DCS");

    const collegeOptions = ["All", "CAMS", "CLAE", "CBA", "COECSA", "CFAD", "CITHM", "CON"];
    const deptOptions = ["All", "DOA", "DOE", "DCS"];

    return (
        <div className="uSidebar-filter">
            <h2 className="text-xl font-semibold mb-2.5">College and Department</h2>
            
            {/* College Dropdown */}
            <Dropdown 
                label="College"
                options={collegeOptions}
                selectedValue={selectedCollege}
                onChange={(value) => {
                    setSelectedCollege(value);
                    if (value !== "COECSA") setSelectedDept(""); // Reset department if not COECSA
                }}
            />

            {/* Department Dropdown (Only Visible if COECSA is Selected) */}
            {selectedCollege === "COECSA" && (
                <Dropdown 
                    label="Department"
                    options={deptOptions}
                    selectedValue={selectedDept}
                    onChange={setSelectedDept}
                />
            )}
        </div>
    );
}

// Reusable Dropdown Component
const Dropdown = ({ label, options, selectedValue, onChange }) => (
    <div className="mb-2">
        <label className="text-sm font-semibold block mb-1">{label}:</label>
        <div className="relative w-full">
            <select
                className="text-sm rounded-xl border border-grey bg-white focus:outline-none focus:ring-0 appearance-none px-4 py-2 w-full"
                value={selectedValue}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow */}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
        </div>
    </div>
);
