import React from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 1, Rating: 2 },
  { name: 2, Rating: 6 },
  { name: 3, Rating: 14 },
  { name: 4, Rating: 36 },
  { name: 5, Rating: 98 },
]

const PastReviews = () => (
  <div className="bg-white p-4 rounded-lg border-grey border">
    <h3 className="text-2xl font-semibold mb-2">Rating Breakdown</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Rating" fill="#902424 " />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)
export default PastReviews;