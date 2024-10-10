import React, { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TableHeader = ({ columns }) => (
  <thead className="bg-gray-50">
    <tr>
      {columns.map((column, index) => (
        <th
          key={index}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {column}
        </th>
      ))}
    </tr>
  </thead>
);

const CirculationTable = ({ title, data, columns, showDeadline = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 ">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <div className="mt-1 flex justify-between">
          <div className="flex items-center">
            <span className="mr-2">Sort By:</span>
            <select className="form-select text-sm">
              <option>Descending</option>
              <option>Ascending</option>
            </select>
            <span className="mx-2">Date Range:</span>
            <input type="date" className="form-input text-sm" />
            <span className="mx-2">to</span>
            <input type="date" className="form-input text-sm" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="form-input text-sm pl-8"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className='overflow-auto'>
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <TableHeader columns={columns} />
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.type === 'Borrow'
                        ? 'bg-green-100 text-green-800'
                        : item.type === 'Return'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.borrower}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>
                {showDeadline && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.deadline}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BookCirculation() {
  const circulationHistoryData = [
    { type: 'Borrow', date: 'August 23', time: '1:24 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422' },
    { type: 'Return', date: 'August 23', time: '1:09 PM', borrower: 'Michael Neigler', title: 'Minecraft Story Mode', id: 'TKK-1201' },
    // Add more items as needed
  ];

  const borrowedBooksData = [
    { type: 'Borrow', date: 'August 23', time: '1:24 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422', deadline: 'August 30' },
    // Add more items as needed
  ];

  const returnedBooksData = [
    { type: 'Return', date: 'August 23', time: '1:09 PM', borrower: 'Michael Neigler', title: 'Minecraft Story Mode', id: 'TKK-1201', deadline: 'September 21' },
    // Add more items as needed
  ];

  const overdueBooksData = [
    { type: 'Overdue', date: 'August 23', time: '1:09 PM', borrower: 'Michael Neigler', title: 'Minecraft Story Mode', id: 'TKK-1201', deadline: 'September 21' },
    // Add more items as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <CirculationTable
        title="Book Circulation History"
        data={circulationHistoryData}
        columns={['Type', 'Date', 'Time', 'Borrower', 'Book Title', 'Book ID']}
      />

      <CirculationTable
        title="Borrowed Books"
        data={borrowedBooksData}
        columns={['Type', 'Date', 'Time', 'Borrower', 'Book Title', 'Book ID', 'Deadline']}
        showDeadline
      />

      <CirculationTable
        title="Returned Books"
        data={returnedBooksData}
        columns={['Type', 'Date', 'Time', 'Borrower', 'Book Title', 'Book ID', 'Deadline']}
        showDeadline
      />

      <CirculationTable
        title="Overdue Books"
        data={overdueBooksData}
        columns={['Type', 'Date', 'Time', 'Borrower', 'Book Title', 'Book ID', 'Deadline']}
        showDeadline
      />
    </div>
  );
}
