import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModifySchedule = ({ isOpen, onClose }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    if (!isOpen) return null;

    const CustomInput = ({ value, onClick }) => (
        <button className="inputBox text-left" onClick={onClick}>
            {value || "Select date range"}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-left">Modify Schedule</h2>
                <p className="text-sm text-gray-600 mb-6 ml-3 text-left">

                    Note: When closing the ARC on the same day, no fines will be incurred on overdue accounts.
                    <br />Note: After selecting the first date, hover to another date to complete the date range.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Date Range:</span>
                        <div className="flex-1 flex justify-end">
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => setDateRange(update)}
                                customInput={<CustomInput />}
                                className="inputBox"
                            />
                        </div>
                    </div>


                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Operating Times:</span>
                        <input
                            type="text"
                            placeholder="XX:XX-XX:XX (Indicate if Whole day or Half day)"
                            className="inputBox text-gray-400 placeholder-grey focus:text-black"
                        />
                    </div>

                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Notes:</span>
                        <input
                            type="text"
                            placeholder="None"
                            className="inputBox text-gray-400 placeholder-grey focus:text-black"
                        />
                    </div>

                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">The ARC is...?:</span>
                        <div className="flex-grow flex space-x-4 items-end justify-end">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="arcStatus" defaultChecked />
                                <span>Open</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="arcStatus" />
                                <span>Closed</span>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        className="modifyButton"
                        onClick={onClose}
                    >
                        Modify
                    </button>
                    <button
                        className="cancelButton"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ModifySchedule;