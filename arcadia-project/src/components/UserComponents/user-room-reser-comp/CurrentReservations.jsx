import { useEffect, useState } from 'react';
import { supabase } from "../../../supabaseClient";

export default function Component() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function fetchReservations() {
      const { data, error } = await supabase
        .from('reservation') // Replace with the actual table name
        .select('reservationData, userID') // Assuming the reserve data and user ID are in this table
        .neq('reservationData', null);

      if (error) {
        console.error('Error fetching reservations:', error);
      } else {
        const reservationData = await Promise.all(
          data.map(async (reservation) => {
            const { reservationData, userID } = reservation;
            
            // Fetch user data
            const { data: userData, error: userError } = await supabase
              .from('user_accounts') // Replace with the actual table name
              .select('userFName, userLName')
              .eq('userID', userID)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
            }

            // Combine user first and last name
            const borrower = `${userData?.userFName} ${userData?.userLName}`;

            // Extract details from the reserve_data JSONB
            const { room, startTime, endTime, date } = reservationData;

            // Get the current date and time
            const currentDateTime = new Date();

            // Combine the reservation date and time for comparison
            const reservationStart = new Date(`${date} ${startTime}`);
            const reservationEnd = new Date(`${date} ${endTime}`);

            // Check if the reservation time has passed and update the status
            const status = reservationEnd < currentDateTime ? "Finished" : "Reserved";

            return {
              room,
              status,
              date,
              period: `${startTime} - ${endTime}`,
              borrower
            };
          })
        );

        setReservations(reservationData);
      }
    }

    fetchReservations();
  }, []);

  return (
    <div className="uMain-cont p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-arcadia-black">Current Reservations</h2>

        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green rounded"></div>
            <span className="text-sm text-dark-gray">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-arcadia-yellow rounded"></div>
            <span className="text-sm text-dark-gray">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-a-t-red rounded"></div>
            <span className="text-sm text-dark-gray">Unavailable/Padding</span>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-dark-gray">Room</th>
                <th className="text-left py-2 px-4 font-medium text-dark-gray">Status</th>
                <th className="text-left py-2 px-4 font-medium text-dark-gray">Date</th>
                <th className="text-left py-2 px-4 font-medium text-dark-gray">Period</th>
                <th className="text-left py-2 px-4 font-medium text-dark-gray">Borrower</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2 px-4 bg-light-gray font-medium">{reservation.room}</td>
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      reservation.status === "Reserved"
                        ? "bg-dark-yellow text-dark-gray"
                        : "bg-green text-dark-gray"
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{reservation.date}</td>
                  <td className="py-2 px-4">{reservation.period}</td>
                  <td className="py-2 px-4">{reservation.borrower}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
