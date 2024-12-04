import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '../supabaseClient'; // Import your Supabase client

const ModifySchedule = ({ isOpen, onClose, event, onModify, onDelete }) => {
    const [dateRange, setDateRange] = useState([event?.start || new Date(), event?.end || new Date()]);
    const [startDate, endDate] = dateRange;
    const [startTime, setStartTime] = useState(event?.startTime || '07:00');
    const [endTime, setEndTime] = useState(event?.endTime || '17:00');
    const [eventTitle, setEventTitle] = useState(event?.title || '');

    useEffect(() => {
        if (event) {
            console.log('Event:', event); // Check event structure
            setStartTime(event.startTime || '07:00');
            setEndTime(event.endTime || '17:00');
            setDateRange([event.start || new Date(), event.end || new Date()]);
        }
    }, [event]);

    if (!isOpen || !event) return null;

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <button ref={ref} className="inputBox text-left" onClick={onClick}>
            {value || "Select date range"}
        </button>
    ));

    const handleSave = async () => {
        // Check if startDate is defined
        if (!startDate) {
            console.error("Start date is not defined.");
            return;  // Exit the function if the date is not defined
        }
    
        const modifiedEvent = { 
            ...event, 
            startTime, 
            endTime, 
            start: startDate, 
            end: endDate, 
            title: eventTitle 
        };
    
        // Prepare the data to be saved in the Supabase 'schedule' table as a JSONB object
        const eventData = {
            date: startDate.toISOString().split('T')[0], // Format to yyyy-mm-dd
            time: `${startTime} to ${endTime}`,
            event: eventTitle, // Only the title of the event
        };
    
        // Now perform an upsert operation to replace the existing event if it already exists
        const { data, error } = await supabase
            .from('schedule')
            .upsert([{
                event_data: eventData,
                // Optionally, use a unique identifier to match the event
                // For example, you could match by date and time or use an event ID if available.
            }], { onConflict: ['event_data'] });  // This will replace the existing record if a conflict is found on event_data
    
        if (error) {
            console.error("Error saving event:", error.message);
        } else {
            // Pass the modified event back to the parent if needed
            onModify(modifiedEvent);
        }
    };
    
    const handleDelete = () => {
        onDelete(event); // Pass the event to the parent to be deleted
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-left">Modify Schedule</h2>
                <p className="text-sm text-gray-600 mb-6 ml-3 text-left">
                    Note: After selecting the first date, hover to another date to complete the date range.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Date Range:</span>
                        <div className="flex-1 flex justify-end">
                            <DatePicker
                                selectsRange
                                startDate={startDate || new Date()}
                                endDate={endDate || new Date()}
                                onChange={(update) => setDateRange(update)}
                                customInput={<CustomInput />}
                            />
                        </div>
                    </div>

                    {/* Operating Time selection */}
                    <div className="flex items-center">
                        <span className="w-32 text-sm font-medium">Operating Times:</span>
                        <div className="flex space-x-4 right-0">
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value || '07:00')}  // Always update with valid value
                                className="inputBox"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value || '17:00')}  // Always update with valid value
                                className="inputBox"
                            />
                        </div>
                    </div>

                    {/* Event section */}
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
                    <button className="deleteButton" onClick={handleDelete}>
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
