import React from "react";
import { FiChevronRight } from "react-icons/fi";

const BookCirculationTable = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow"> {/* Adjusted padding */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Book Circulation</h3>
        <button className="text-arcadia-red text-sm flex items-center">
          See more <FiChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Allow overflow to be handled properly */}
      <div className="overflow-hidden"> {/* Changed from overflow-auto to overflow-hidden */}
        <table className="min-w-full max-w-full divide-y divide-gray-200"> {/* Added max-w-full */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { type: 'Borrow', date: 'August 23', time: '1:24 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422' },
              { type: 'Return', date: 'August 23', time: '1:09 PM', borrower: 'Michael Neigler', title: 'Minecraft Story Mode', id: 'TKK-1201' },
              { type: 'Overdue', date: 'August 23', time: '1:09 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422' },
              { type: 'Borrow', date: 'August 24', time: '2:30 PM', borrower: 'Emma Watson', title: 'Harry Potter and the Philosopher\'s Stone', id: 'HP-0001' },
              { type: 'Return', date: 'August 24', time: '3:15 PM', borrower: 'John Smith', title: 'The Great Gatsby', id: 'GG-1925' },
              { type: 'Overdue', date: 'August 25', time: '10:00 AM', borrower: 'Sarah Connor', title: 'Terminator: Future War', id: 'TFW-2029' },
              { type: 'Borrow', date: 'August 25', time: '11:45 AM', borrower: 'Tony Stark', title: 'Advanced Robotics', id: 'AR-3000' },
              { type: 'Return', date: 'August 26', time: '9:20 AM', borrower: 'Bruce Wayne', title: 'Detective Comics', id: 'DC-0027' }
            ].map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'Borrow' ? 'bg-green-100 text-green-800' : item.type === 'Return' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.borrower}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.id}</td> {/* Ensure Book ID is shown */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookCirculationTable;
