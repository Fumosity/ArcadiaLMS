import React from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jun 2023', value: 20 },
  { name: 'Sep 2023', value: 25 },
  { name: 'Dec 2023', value: 30 },
  { name: 'Mar 2024', value: 35 },
  { name: 'Jun 2024', value: 28 },
]

const reviews = [
  { date: 'August 23', time: '1:24 PM', reviewer: 'Alex Jones', review: 'It was pretty good, though beware of some weird plot points.', rating: 4.5 },
  { date: 'August 23', time: '1:24 PM', reviewer: 'Alex Jones', review: 'It was pretty good, though beware of some weird plot points.', rating: 4.5 },
  { date: 'August 23', time: '1:24 PM', reviewer: 'Alex Jones', review: 'It was pretty good, though beware of some weird plot points.', rating: 4.5 },
]

const ARPastReview = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Past Reviews</h3>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Time', 'Reviewer', 'Review', 'Rating'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewer}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{review.review}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
)
export default ARPastReview;