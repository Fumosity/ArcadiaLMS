import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../supabaseClient';

const LibBookCirc = () => {
  const [timeFrame, setTimeFrame] = useState("month");
  const [circulationData, setCirculationData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Helper functions remain the same...
  const groupDataByTimeFrame = (data, timeFrame) => {
    const groupedData = {};

    const fillMissingEntries = (keys, defaultValue = { borrowed: 0, returned: 0 }) => {
      keys.forEach((key) => {
        if (!groupedData[key]) {
          groupedData[key] = { ...defaultValue };
        }
      });
    };

    if (timeFrame === "day") {
      // Initialize 24-hour timeline
      for (let hour = 0; hour < 24; hour++) {
        const timeLabel = `${hour}:00`;
        groupedData[timeLabel] = { borrowed: 0, returned: 0 };
      }

      data.forEach((entry) => {
        const date = new Date(entry.date);
        const timeLabel = `${date.getHours()}:00`;
        if (groupedData[timeLabel]) {
          if (entry.type === "Borrowed") groupedData[timeLabel].borrowed += 1;
          else if (entry.type === "Returned") groupedData[timeLabel].returned += 1;
        }
      });

    } else if (timeFrame === "week") {
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Sunday
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split('T')[0]; // Return as YYYY-MM-DD for consistency
      });

      data.forEach((entry) => {
        const dateLabel = new Date(entry.date).toISOString().split('T')[0];
        if (!groupedData[dateLabel]) groupedData[dateLabel] = { borrowed: 0, returned: 0 };
        if (entry.type === "Borrowed") groupedData[dateLabel].borrowed += 1;
        else if (entry.type === "Returned") groupedData[dateLabel].returned += 1;
      });

      fillMissingEntries(weekDays);
    } else if (timeFrame === "month") {
      // Initialize month timeline with all days of the month
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        return date.toLocaleDateString();
      });

      data.forEach((entry) => {
        const dateLabel = new Date(entry.date).toLocaleDateString();
        if (!groupedData[dateLabel]) groupedData[dateLabel] = { borrowed: 0, returned: 0 };
        if (entry.type === "Borrowed") groupedData[dateLabel].borrowed += 1;
        else if (entry.type === "Returned") groupedData[dateLabel].returned += 1;
      });

      fillMissingEntries(monthDays);
    }

    // Return grouped data in sorted order of keys
    return Object.keys(groupedData)
      .sort((a, b) => new Date(a) - new Date(b))  // Sorting dates correctly
      .map((key) => ({
        name: key,
        ...groupedData[key],
      }));
  };

  const processTableData = (data, timeFrame) => {
    const currentDate = new Date();
    return data.filter(entry => {
      const date = new Date(entry.date);
      if (timeFrame === "day") {
        return date.setHours(0, 0, 0, 0) <= currentDate && date.setHours(23, 59, 59, 999) >= currentDate;
      } else if (timeFrame === "week") {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      } else if (timeFrame === "month") {
        return `${date.getMonth() + 1}-${date.getFullYear()}` === `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      }
      return true;
    });
  };

  const formatTransactionData = (data) => {
    const today = new Date();
    return data.map((item) => {
      const dueDate = new Date(item.checkout_date); // Assuming checkout_date is the due date
      const returnDate = new Date(item.checkin_date || item.checkout_date);
      const isOverdue = returnDate > dueDate;
  
      return {
        type: item.transaction_type,
        date: item.checkin_date || item.checkout_date,
        time: item.checkin_time || item.checkout_time,
        borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
        bookTitle: item.book_indiv?.book_titles?.title || '',
        bookId: item.bookID,
        overdue: isOverdue && item.transaction_type === "Borrowed",
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('book_transactions')
          .select(`transaction_type, checkin_date, checkin_time, checkout_date, checkout_time, userID, bookID, book_indiv(book_titles(title, price)), user_accounts(userFName, userLName, userLPUID)`);

        if (error) {
          console.error("Error fetching data: ", error.message);
        } else {
          const formattedData = data.map(item => {
            const date = item.checkin_date || item.checkout_date;
            const time = item.checkin_time || item.checkout_time;
            const formattedTime = time ? new Date(`1970-01-01T${time}`).toLocaleString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true }) : '';

            return {
              type: item.transaction_type,
              date,
              time: formattedTime,
              borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
              bookTitle: item.book_indiv?.book_titles?.title || '',
              bookId: item.bookID,
            };
          });

          setCirculationData(groupDataByTimeFrame(formattedData, timeFrame));
          setTableData(processTableData(formattedData, timeFrame));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div className="bg-white overflow-hidden border border-grey p-6 rounded-lg w-full">
      <h3 className="text-xl font-semibold mb-4">Book Circulation</h3>

      {/* Time Frame Selector */}
      <div className="mb-4">
        <label htmlFor="time-frame" className="mr-2">Select Time Frame:</label>
        <select
          id="time-frame"
          onChange={(e) => setTimeFrame(e.target.value)}
          value={timeFrame}
          className="border border-gray-300 rounded-md py-1 px-2"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Bar Chart for Book Circulation */}
      <div className="w-full mb-6">
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={circulationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="borrowed" fill="#e8d08d" />
            <Bar dataKey="returned" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Book Circulation History Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Book Circulation History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Start Date & Time</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">End Date & Time</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {tableData.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                        ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}>
                    {book.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.date} {book.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.date} {book.time}</td>
                  <td className="px-4 py-3 text-sm text-blue-600">{book.borrower}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibBookCirc;
