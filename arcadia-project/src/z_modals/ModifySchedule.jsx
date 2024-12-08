import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const ModifySchedule = ({ isOpen, onClose, event, onModify, onDelete }) => {
    const [startDate, setStartDate] = useState(event?.start || new Date());
    const [endDate, setEndDate] = useState(event?.end || event?.start || new Date());
    const [startTime, setStartTime] = useState(event?.start ? moment(event.start).format("HH:mm") : "07:00");
    const [endTime, setEndTime] = useState(event?.end ? moment(event.end).format("HH:mm") : "17:00");
    const [eventTitle, setEventTitle] = useState(event?.title || "");
    const [isMultiDay, setIsMultiDay] = useState(
        moment(event?.start).format("YYYY-MM-DD") !== moment(event?.end).format("YYYY-MM-DD")
    );

    useEffect(() => {
        if (event) {
            setStartDate(event.start || new Date());
            setEndDate(event.end || event.start || new Date());
            setStartTime(moment(event.start).format("HH:mm"));
            setEndTime(moment(event.end).format("HH:mm"));
            setEventTitle(event.title || "");
            setIsMultiDay(moment(event.start).format("YYYY-MM-DD") !== moment(event.end).format("YYYY-MM-DD"));
        }
    }, [event]);

    const handleMultiDayToggle = (checked) => {
        setIsMultiDay(checked);
        if (!checked) {
            setEndDate(startDate); // Reset endDate to match startDate when multi-day is unchecked
        }
    };

    const handleSave = () => {
        const modifiedEvent = {
            ...event,
            title: eventTitle,
            start: moment(startDate).set({
                hour: parseInt(startTime.split(":")[0]),
                minute: parseInt(startTime.split(":")[1]),
            }).toDate(),
            // Add 1 day for multi-day events to include the last day
            end: isMultiDay
                ? moment(endDate).set({
                    hour: parseInt(endTime.split(":")[0]),
                    minute: parseInt(endTime.split(":")[1]),
                }).add(1, 'days').toDate()  // Add 1 day to include the entire day
                : moment(endDate).set({
                    hour: parseInt(endTime.split(":")[0]),
                    minute: parseInt(endTime.split(":")[1]),
                }).toDate(),
            isMultiDay,
        };
    
        onModify(modifiedEvent);
        onClose();
    };

    if (!isOpen) return null;

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <button ref={ref} className="inputBox text-left" onClick={onClick}>
            {value || "Select date"}
        </button>
    ));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-left">Modify Schedule</h2>
                <p className="text-sm text-gray-600 mb-6 ml-3 text-left">
                    Note: Check the box below to make it a multi-day event.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Date:</span>
                        <div className="flex-1 flex justify-end items-center space-x-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    if (!isMultiDay) setEndDate(date); // Ensure start and end dates match for single day
                                }}
                                customInput={<CustomInput />}
                            />
                            {isMultiDay && (
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    minDate={startDate}
                                    customInput={<CustomInput />}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center mt-2">
                        <span className="w-32 text-sm font-medium">Multi-day:</span>
                        <input
                            type="checkbox"
                            checked={isMultiDay}
                            onChange={(e) => handleMultiDayToggle(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                    </div>

                    {!isMultiDay && (
                        <div className="flex items-center mt-2">
                            <span className="w-32 text-sm font-medium">Operating Time:</span>
                            <div className="flex space-x-4">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="inputBox"
                                />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="inputBox"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Event:</span>
                        <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Enter event title"
                            className="inputBox"
                        />
                    </div>
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button className="modifyButton" onClick={handleSave}>
                        Modify
                    </button>
                    <button className="deleteButton" onClick={() => onDelete(event)}>
                        Delete
                    </button>
                    <button className="cancelButton" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifySchedule;
