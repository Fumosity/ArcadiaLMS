import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ModifySchedule from '../../z_modals/ModifySchedule'; // Import the modal component
import { supabase } from '../../supabaseClient'; // Import your Supabase client

const localizer = momentLocalizer(moment);

export default function WeeklySched() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch schedule from Supabase on mount
    useEffect(() => {
        const fetchSchedule = async () => {
            const { data, error } = await supabase
                .from('schedule')
                .select('event_data'); // Fetch the event_data JSONB object

            if (error) {
                console.error('Error fetching schedule:', error);
                return;
            }

            // Format the data into the correct structure for the calendar
            const formattedEvents = data.map((event) => {
                const { date, time, event: eventName } = event.event_data; // Destructure the event_data object
                const [startTime, endTime] = time.split(' to '); // Split the time string into start and end times

                // Construct the start and end date objects
                const start = moment(`${date} ${startTime}`).toDate(); // Combine date and startTime
                const end = moment(`${date} ${endTime}`).toDate(); // Combine date and endTime

                return {
                    title: eventName,
                    start,
                    end
                };
            });

            setEvents(formattedEvents); // Update the state with formatted events
        };

        fetchSchedule(); // Call the function to fetch events
    }, []); // Empty dependency array to run only once when the component mounts


    const handleSelect = ({ start, end }) => {
        const event = events.find((e) => e.start.getTime() === start.getTime() && e.end.getTime() === end.getTime());
        if (event) {
            setSelectedEvent(event);
        } else {
            setSelectedEvent({
                title: 'New Event',
                start,
                end,
                notes: '' // You can also handle other fields like notes
            });
        }
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleModifySchedule = (modifiedEvent) => {
        setEvents((prev) => {
            const existingEventIndex = prev.findIndex((event) =>
                event.start.getTime() === modifiedEvent.start.getTime() && event.end.getTime() === modifiedEvent.end.getTime()
            );
            if (existingEventIndex !== -1) {
                const updatedEvents = [...prev];
                updatedEvents[existingEventIndex] = modifiedEvent; // Replace the old event with the modified one
                return updatedEvents;
            } else {
                return [...prev, modifiedEvent]; // Add the new event if it's not found
            }
        });
        handleCloseModal(); // Close the modal after saving
    };

    const handleDeleteSchedule = (eventToDelete) => {
        setEvents((prev) => prev.filter((event) => event.start.getTime() !== eventToDelete.start.getTime() || event.end.getTime() !== eventToDelete.end.getTime()));
        handleCloseModal(); // Close the modal after deleting
    };

    return (
        <div>
            <h2>Weekly Schedule</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelect}
                onSelectEvent={handleSelect}
            />
            {isModalOpen && (
                <ModifySchedule
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    event={selectedEvent}
                    onModify={handleModifySchedule}
                    onDelete={handleDeleteSchedule}
                />
            )}
        </div>
    );
}
