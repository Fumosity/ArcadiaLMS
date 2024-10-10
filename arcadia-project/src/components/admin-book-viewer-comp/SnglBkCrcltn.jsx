import React from "react";
import { FiChevronRight } from "react-icons/fi";

const snglbkCircData = [
  {
    type: "Borrowed",
    date: "November 1",
    time: "12:15 PM",
    borrower: "Alex Jones",
    bookTitle: "Book of Revelations",
    bookId: "JADE-0422",
    due: "August 30",
  },
  {
    type: "Borrowed",
    date: "August 23",
    time: "10:00 AM",
    borrower: "Keith Thurman",
    bookTitle: "Moises' Fat Juice",
    bookId: "B450-PR0",
    due: "August 30",
  },
  {
    type: "Borrowed",
    date: "January 1",
    time: "2:30 PM",
    borrower: "Von Fadri",
    bookTitle: "Chinese New Year",
    bookId: "TECH-211",
    due: "August 30",
  },
  {
    type: "Borrowed",
    date: "September 11",
    time: "9:11 AM",
    borrower: "Vladimir Y.",
    bookTitle: "Terrorist Attacks",
    bookId: "TWN-101",
    due: "August 30",
  },
];

const SnglBkCrcltn = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Header with "See more" button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Book Circulation</h3>
        <button className="text-arcadia-red text-sm flex items-center">
          See more <FiChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
          {snglbkCircData.map((book, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-sm text-gray-900">{book.type}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{book.date}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{book.time}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{book.borrower}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{book.bookTitle}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{book.bookId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SnglBkCrcltn;
