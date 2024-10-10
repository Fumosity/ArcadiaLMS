import React from "react";


const circulationData = [
    { type: 'Borrow', date: 'August 23', time: '1:24 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422' },
    { type: 'Return', date: 'August 23', time: '1:09 PM', borrower: 'Michael Neigler', title: 'Minecraft Story Mode', id: 'TKK-1201' },
    { type: 'Borrow', date: 'August 23', time: '1:24 PM', borrower: 'Alex Jones', title: 'Book of Revelations', id: 'JADE-0422' },
  ]


const BookCirculation = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Book Circulation</h3>
        <button className="text-blue-600 text-sm">See more</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Type', 'Date', 'Time', 'Borrower', 'Book Title', 'Book ID'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {circulationData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.type === 'Borrow' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.borrower}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
)
export default BookCirculation