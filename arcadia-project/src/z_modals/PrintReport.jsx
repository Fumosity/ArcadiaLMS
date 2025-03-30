import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PrintReport = ({ isOpen, onClose }) => {
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
        <h2 className="text-2xl font-semibold mb-4 text-left">Print A Report</h2>
        <p className="text-sm text-gray-600 mb-6 ml-3 text-left">
          Print a report in a *.xlsx or *.csv format. <br />NOTE: After selecting the first date, hover to another date to complete the date range.
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
            <span className="w-32 text-sm font-medium">Filter by Reason:</span>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="reason" defaultChecked />
                <span>All</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="reason" />
                <span>Overdue</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="reason" />
                <span>Damages</span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">File Format:</span>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="format" defaultChecked />
                <span>Excel file (*.xlsx)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="format" />
                <span>Comma-separated values (*.csv)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="penBtn"
            onClick={onClose}
          >
            Upload
          </button>
          <button
            className="cancelModify"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReport;