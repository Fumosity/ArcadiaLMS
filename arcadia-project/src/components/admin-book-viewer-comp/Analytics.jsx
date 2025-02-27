import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SnglBkCrcltn from "./SnglBkCrcltn";

const data = [
  { name: 'Sep 17', value: 34.5 },
  { name: 'Sep 18', value: 34.8 },
  { name: 'Sep 19', value: 34.2 },
  { name: 'Sep 20', value: 33.5 },
];

const Analytics = ({ titleID }) => {
  console.log("Analytics received titleID:", titleID); // Debug log to confirm
  return(
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-2">Analytics</h3>

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
      <SnglBkCrcltn titleID={titleID}/>
    </div>
  );
};

export default Analytics;
