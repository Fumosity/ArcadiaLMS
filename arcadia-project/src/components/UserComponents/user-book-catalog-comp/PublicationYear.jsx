import React, { useState } from "react";

export default function PublicationYear() {
    const [selectedYear, setSelectedYear] = useState(''); // Single select logic
    const yearOptions = ['All', 'Last 5 Years', 'Last 10 Years', 'Last 25 Years'];

    const handleYearSelect = (year) => {
        setSelectedYear(year); // Single-select only, updating `selectedYear`
    };

    return (
        <div>
            <h3 className="font-semibold mb-2">Publication Year</h3>
            <div className="space-y-2">
                {yearOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={option.toLowerCase().replace(/\s/g, '-')}
                            checked={selectedYear === option} // Single-select condition
                            onChange={() => handleYearSelect(option)} // Update `selectedYear`
                            className="custom-checkbox" // Applying custom class styling
                        />
                        <label htmlFor={option.toLowerCase().replace(/\s/g, '-')} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}

                <div className="mt-4">
                    <p className="text-sm mb-2">Custom Year Range:</p>
                    <div className="flex items-center space-x-2">
                        <div>
                            <b><label htmlFor="from" className="text-xs block mb-1">From</label></b>
                            <input
                                type="number"
                                id="from"
                                className="w-24 py-0.5 text-dark-grey border border-grey rounded-2xl text-sm text-right"
                                placeholder="2015"
                            />
                        </div>
                        <div>
                            <b><label htmlFor="to" className="text-xs block mb-1">Through</label></b>
                            <input
                                type="number"
                                id="to"
                                className="w-24 py-0.5 text-dark-grey border border-grey rounded-2xl text-sm text-right"
                                placeholder="2025"
                            />
                        </div>
                    </div>
                    <button className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-0.5 px-4 rounded-xl text-sm">
                        Apply Year Range
                    </button>
                </div>
            </div>
        </div>
    );
}
