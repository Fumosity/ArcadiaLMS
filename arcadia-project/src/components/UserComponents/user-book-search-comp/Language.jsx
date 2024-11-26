import React, { useState } from "react";

export default function Language() {
    const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default to 'English'
    const languageOptions = ['All', 'English', 'Filipino', 'Other'];

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language); // Set the selected language to allow single selection
    };

    return (
        <div className="uSidebar-filter">
            <h3 className="text-xl font-semibold mb-2.5">Language</h3>
            <div className="space-y-2">
                {languageOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`language-${option.toLowerCase()}`}
                            checked={selectedLanguage === option} // Single-select logic
                            onChange={() => handleLanguageSelect(option)} // Update `selectedLanguage`
                            className="custom-checkbox" // Apply custom styling
                        />
                        <label htmlFor={`language-${option.toLowerCase()}`} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
