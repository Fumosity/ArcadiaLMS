import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom";

export default function ReservationsTable() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  return (
    <div className="bg-white border border-grey p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Today's Reservations</h3>
        <button onClick={() => navigate('/admin/reservations')} className="rounded-full py-1 px-3 text-sm border border-grey hover:bg-light-gray">
          See more
        </button>
      </div>

      <div className="w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booker</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
              { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
              { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
            ].map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.room}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.booker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

}