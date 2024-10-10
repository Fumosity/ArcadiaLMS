import React from "react";
import BookCirculation from "./BookCirculation";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Sep 17', value: 34.5 },
    { name: 'Sep 18', value: 34.8 },
    { name: 'Sep 19', value: 34.2 },
    { name: 'Sep 20', value: 33.5 },
  ]

const Analytics = () => (
    <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-4">Analytics</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <BookCirculation />

  </div>
    
  
)

export default Analytics