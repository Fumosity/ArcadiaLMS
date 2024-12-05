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
                .select('eventID, event_data'); // Include eventID in the select

            if (error) {
                console.error('Error fetching schedule:', error);
                return;
            }

            const formattedEvents = data.map((event) => {
                const { date, time, event: eventName } = event.event_data;
                const [startTime, endTime] = time.split(' to ');
                const start = moment(`${date} ${startTime}`).toDate();
                const end = moment(`${date} ${endTime}`).toDate();

                return {
                    title: eventName,
                    start,
                    end,
                    eventID: event.eventID // Ensure eventID is included
                };
            });

            setEvents(formattedEvents); // Update the state with formatted events
        };

        fetchSchedule(); // Call the function to fetch events
    }, []); // Empty dependency array to run only once when the component mounts


    const handleSelect = ({ start, end }) => {
        const event = events.find(
            (e) => e.start.getTime() === start.getTime() && e.end.getTime() === end.getTime()
        );

        if (event) {
            setSelectedEvent(event); // Pass the full event, including eventID
        } else {
            setSelectedEvent({
                title: 'New Event',
                start,
                end,
                eventID: null // New events won't have an eventID
            });
        }
        setIsModalOpen(true);
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

    const handleDeleteSchedule = async (eventToDelete) => {
        if (!eventToDelete.eventID) {
            console.error('Error: eventID is undefined. Cannot delete event.');
            return;
        }

        try {
            const { error } = await supabase
                .from('schedule')
                .delete()
                .match({ eventID: eventToDelete.eventID }); // Use the eventID to delete

            if (error) {
                console.error('Error deleting event:', error);
            } else {
                setEvents((prev) =>
                    prev.filter(
                        (event) =>
                            event.start.getTime() !== eventToDelete.start.getTime() ||
                            event.end.getTime() !== eventToDelete.end.getTime()
                    )
                );
            }
        } catch (err) {
            console.error('Unexpected error deleting event:', err);
        } finally {
            handleCloseModal(); // Close the modal after deleting
        }
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
