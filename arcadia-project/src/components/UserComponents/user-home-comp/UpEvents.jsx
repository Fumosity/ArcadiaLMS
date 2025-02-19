import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { supabase } from '../../../supabaseClient';

const UpEvents = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('schedule')
      .select('eventID, eventData');

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    const formattedEvents = data.map((event) => {
      const { event: title, start, end, isMultiDay, allDays } = event.eventData;
      
      if (isMultiDay && allDays) {
        const firstDay = allDays[0];
        const lastDay = allDays[allDays.length - 1];
        return {
          title,
          dateRange: `${moment(firstDay.date).format('MMM D')} - ${moment(lastDay.date).format('MMM D')}`,
          start: moment(firstDay.date).toDate(),
          end: moment(lastDay.date).toDate(),
        };
      }

      return {
        title,
        dateRange: moment(start).isSame(end, 'day') 
          ? moment(start).format('MMM D')
          : `${moment(start).format('MMM D')} - ${moment(end).format('MMM D')}`,
        start: moment(start).toDate(),
        end: moment(end).toDate(),
      };
    });

    // Filter out past events
    const currentDate = new Date();
    const upcomingEvents = formattedEvents.filter(event => moment(event.end).isAfter(currentDate));

    setEvents(upcomingEvents);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event => 
        moment(date).isBetween(event.start, event.end, 'day', '[]')
      );
      return hasEvent ? 'bg-blue-200 text-blue-800' : '';
    }
  };

  return (
    <div className="uSidebar-filter">
      <h2 className="text-xl font-semibold mb-2.5">Upcoming Events</h2>
      {/* Calendar Component */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <Calendar
          onChange={setDate}
          value={date}
          className="mx-auto"
          tileClassName={tileClassName}
        />
      </div>
      
      {/* Events List */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left py-2">Event</th>
            <th className="text-right py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-t border-grey">
              <td className="py-2">{event.title}</td>
              <td className="py-2 text-right">{event.dateRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpEvents;