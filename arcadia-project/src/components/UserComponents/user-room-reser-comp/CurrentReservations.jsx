import { useEffect, useState } from 'react';
import { supabase } from "../../../supabaseClient";

const periods = [
  "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
  "12:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00", "04:00 - 05:00"
];
const rooms = ["A701-A", "A701-B", "A701-C"];

export default function RoomReservation() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    async function fetchReservations() {
      const { data, error } = await supabase
        .from('reservation')
        .select('reservationData');

      if (error) {
        console.error('Error fetching reservations:', error);
        return;
      }

      const availability = {};
      periods.forEach(period => {
        availability[period] = {};
        rooms.forEach(room => {
          availability[period][room] = "Available";
        });
      });

      data.forEach(({ reservationData }) => {
        const { date, room, startTime, endTime } = reservationData;

        let utcDate = new Date(`${date}T00:00:00Z`);
        let phtDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
        let adjustedPHTDate = new Date(phtDate);
        adjustedPHTDate.setDate(adjustedPHTDate.getDate() - 1);

        const formattedDate = adjustedPHTDate.toISOString().split('T')[0];

        if (formattedDate === selectedDate) {
          periods.forEach(period => {
            const [startHour] = period.split(':');
            const periodStartTime = parseInt(startHour, 10);
            const startHourInt = parseInt(startTime.split(':')[0], 10);
            const endHourInt = parseInt(endTime.split(':')[0], 10);

            if (periodStartTime >= startHourInt && periodStartTime < endHourInt) {
              availability[period][room] = "Reserved";
            }
          });
        }
      });

      setReservations(availability);
    }

    fetchReservations();
  }, [selectedDate]);

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentYear, currentMonth, i));
  }

  return (
    <div className="uMain-cont border border-grey rounded-md p-2 space-x-4 mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Room Reservations</h2>
      <div className="flex space-x-4">
      <div className="uMain-cont w-1/2">
        
        <div className="flex justify-between items-center text-sm my-2">
          <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-red rounded">Prev</button>
          <h3>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-red rounded">Next</button>
        </div>
        <div className="grid grid-cols-7 gap-4 p-1 text-sm">
          {calendarDays.map((date, i) => {
            const dateString = date ? date.toISOString().split('T')[0] : null;
            const isPast = date && date < new Date().setHours(0, 0, 0, 0);
            const isSunday = date && date.getDay() === 0;

            return (
              <div
                key={i}
                className={`h-8 w-8 flex items-center justify-center cursor-pointer rounded 
          ${selectedDate === dateString ? 'bg-grey text-black' : 'bg-white'} 
          hover:bg-gray ${!date ? 'opacity-0' : ''} 
          ${isPast || isSunday ? 'text-grey cursor-not-allowed' : ''}`}
                onClick={() => !(isPast || isSunday) && date && setSelectedDate(dateString)}
              >
                {date ? date.getDate() : ""}
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-1/2 mt-10">
        <table className="w-full text-xs border">
          <thead>
            <tr>
              <th className="p-1 border ">Period</th>
              {rooms.map(room => (
                <th key={room} className="p-1 border">{room}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period}>
                <td className="p-1 border">{period}</td>
                {rooms.map(room => (
                  <td key={room} className={`p-1 border ${reservations[period]?.[room] === "Reserved" ? 'bg-red text-white' : 'bg-green text-white'}`}>
                    {reservations[period]?.[room] || "Available"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
