import React, { useState } from "react";

export default function CollegeAndDept() {
    const [selectedCollege, setSelectedCollege] = useState('COECSA'); // Default to 'English'
    const collegeOptions = ['All', 'CAMS', 'CLAE', 'CBA', 'COECSA', 'CFAD', 'CITHM', 'CON'];

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college); // Set the selected language to allow single selection
    };


    const [selectedDept, setSelectedDept] = useState('DCS');
    const deptOptions = ['All', 'DOA', 'DOE', 'DCS'];

    const handleDeptSelect = (dept) => {
        setSelectedDept(dept);
    };

    return (
        <div className="">
            <h3 className="font-semibold mb-2">Collage and Department</h3>
            <div className="space-y-2">
                <h4 className="mb-2">College</h4>
                {collegeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`college-${option.toLowerCase()}`}
                            checked={selectedCollege === option} // Single-select logic
                            onChange={() => handleCollegeSelect(option)} // Update `selectedLanguage`
                            className="custom-checkbox" // Apply custom styling
                        />
                        <label htmlFor={`college-${option.toLowerCase()}`} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            <div className="border-t border-grey space-y-2 mt-2 mb-2">
                <h4 className="mb-2">Department</h4>
                {deptOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`dept-${option.toLowerCase()}`}
                            checked={selectedDept === option} // Single-select logic
                            onChange={() => handleDeptSelect(option)} // Update `selectedLanguage`
                            className="custom-checkbox" // Apply custom styling
                        />
                        <label htmlFor={`dept-${option.toLowerCase()}`} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>


    );
}
