import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';  // Import the dayGrid plugin
import { supabase } from "../../supabaseClient";

export default function ARoomReservations() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservation')
        .select('reservationData');  // Adjust the fields as needed

      if (error) {
        console.error('Error fetching reservations:', error);
        return;
      }

      // Map reservation data to FullCalendar event format
      const formattedEvents = data.map((reservation) => {
        const { date, room, title, startTime, endTime } = reservation.reservationData;
        return {
          title,
          start: `${date}T${startTime}`,  // Combine date and startTime
          end: `${date}T${endTime}`,      // Combine date and endTime
          resourceId: room,               // Use room as resourceId
        };
      });

      setEvents(formattedEvents);
    };

    fetchReservations();
  }, []);

  const resources=[
    { id: "A701-A", title: "Discussion Room 1 (A701-A)" },
    { id: "A701-B", title: "Discussion Room 2 (A701-B)" },
    { id: "A701-C", title: "Discussion Room 3 (A701-C)" },
    { id: "A701-D", title: "Discussion Room 4 (A701-D)" },
  ]

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Room Reservations</h3>
      <FullCalendar
        plugins={[resourceTimelinePlugin, interactionPlugin, dayGridPlugin]}  // Add dayGridPlugin to plugins
        initialView="resourceTimelineDay"  // Default view (resource timeline)
        height={resources.length * 80} // Dynamically set height based on rows
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "resourceTimelineDay,resourceTimelineWeek,dayGridMonth",  // Include dayGridMonth in the header
        }}
        resources={resources} // Use the defined resources
        events={events}
        editable
        selectable
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,  // Use 24-hour format
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,  // Use 24-hour format without AM/PM
        }}
        eventContent={(eventInfo) => {
          return (
            <div>{eventInfo.event.title}</div>
          );
        }}
      />
    </div>
  );
}
