import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';

export default function URoomReservations({ events }) {
  return (
    <div className="bg-white overflow-hidden border-gray-300 mb-8 p-6 rounded-lg w-full border border-grey">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Room Reservations</h2>
      <FullCalendar
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimelineDay"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "resourceTimelineDay,resourceTimelineWeek",
        }}
        resources={[
          { id: "A701-A", title: "Discussion Room 1 (A701-A)" },
          { id: "A701-B", title: "Discussion Room 2 (A701-B)" },
          { id: "A701-C", title: "Discussion Room 2 (A701-C)" },
          { id: "A701-D", title: "Discussion Room 2 (A701-D)" },
        ]}
        events={events}
        editable
        selectable
      />
    </div>
  );
}
