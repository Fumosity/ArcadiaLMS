"use client"

import React, { useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function ModifyEvents({ isOpen, onClose }) {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [color, setColor] = useState('#902424')
  const [eventName, setEventName] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const CustomInput = ({ value, onClick }) => (
    <button className="inputBox text-left" onClick={onClick}>
      {value || "Select date range"}
    </button>
  )

  const handleColorChange = (e) => {
    setColor(e.target.value)
  }

  const handleHexInputChange = (e) => {
    const inputColor = e.target.value
    setColor(inputColor)
    
    
    if (/^#[0-9A-F]{6}$/i.test(inputColor)) {
      document.getElementById('colorPicker').value = inputColor
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-semibold mb-4 text-left">Modify Calendar Events</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Date Range:</span>
            <div className="flex-1 flex justify-end">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                customInput={<CustomInput />}
                className="inputBox"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Event Name:</span>
            <input
              type="text"
              value={eventName}
              placeholder='Enter Event Name'
              onChange={(e) => setEventName(e.target.value)}
              className="inputBox text-gray-400 placeholder-grey focus:text-black"
            />
          </div>

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Set Color:</span>
            <div className="flex-1 flex justify-end items-center space-x-2">
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-8 h-8 rounded-full"
              />
              <input
                type="text"
                value={color}
                onChange={handleHexInputChange}
                className="inputBox w-24 text-right"
                placeholder="#RRGGBB"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Notes:</span>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="None"
              className="inputBox text-gray-400 placeholder-grey focus:text-black"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="modifyButton"
            onClick={onClose}
          >
            Modify
          </button>
          <button
            className="cancelButton"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}