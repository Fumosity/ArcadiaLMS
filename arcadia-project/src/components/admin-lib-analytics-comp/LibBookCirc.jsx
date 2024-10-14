import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BCTable from "./BCTable";

const data = [
  { name: 'Sep 17', value: 34.5 },
  { name: 'Sep 18', value: 34.8 },
  { name: 'Sep 19', value: 34.2 },
  { name: 'Sep 20', value: 33.5 },
];

const LibBookCirc = () => (
  <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full"> {/* Removed height constraints */}
    <h3 className="text-xl font-semibold mb-4">Book Circulation</h3>
    

    {/* Ensure chart container is responsive and grows based on content */}
    <div className="w-full mb-6">
      <ResponsiveContainer width="100%" aspect={2}>
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

    {/* Ensure SnglBkCrcltn adjusts its height based on content */}
    <BCTable />
  </div>
);

export default LibBookCirc;
