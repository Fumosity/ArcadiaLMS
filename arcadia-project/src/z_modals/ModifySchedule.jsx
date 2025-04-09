import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"
import { toast } from "react-toastify"

const ModifySchedule = ({ isOpen, onClose, event, onModify, onDelete }) => {
  const [startDate, setStartDate] = useState(event?.start || new Date())
  const [endDate, setEndDate] = useState(event?.end || event?.start || new Date())
  const [startTime, setStartTime] = useState(event?.start ? moment(event.start).format("HH:mm") : "07:00")
  const [endTime, setEndTime] = useState(event?.end ? moment(event.end).format("HH:mm") : "17:00")
  const [eventTitle, setEventTitle] = useState(event?.title || "")
  const [isMultiDay, setIsMultiDay] = useState(
    // Only set to true if it's an existing event (has eventID) and dates are different
    event?.eventID && moment(event?.start).format("YYYY-MM-DD") !== moment(event?.end).format("YYYY-MM-DD"),
  )

  useEffect(() => {
    if (event) {
      setStartDate(event.start || new Date())
      setEndDate(event.end || event.start || new Date())

      // If this is a new event for the present day, keep the selected time
      // Otherwise use the event's time
      if (!event.eventID && moment(event.start).isSame(moment(), "day")) {
        // Keep the time that triggered the modal
        setStartTime(moment(event.start).format("HH:mm"))

        // Set end time to at least the start time
        const eventEndTime = moment(event.end).format("HH:mm")
        if (
          moment(`2000-01-01 ${eventEndTime}`).isBefore(moment(`2000-01-01 ${moment(event.start).format("HH:mm")}`))
        ) {
          setEndTime(moment(event.start).format("HH:mm"))
        } else {
          setEndTime(eventEndTime)
        }
      } else {
        setStartTime(moment(event.start).format("HH:mm"))
        setEndTime(moment(event.end).format("HH:mm"))
      }

      setEventTitle(event.title || "")
      // Only set multi-day to true for existing events with different dates
      setIsMultiDay(
        event.eventID && moment(event.start).format("YYYY-MM-DD") !== moment(event.end).format("YYYY-MM-DD"),
      )
    }
  }, [event])

  // Check if a date/time is in the past
  const isPastDateTime = (date, time) => {
    const now = new Date()
    const selectedDateTime = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    selectedDateTime.setHours(hours, minutes, 0, 0)
    return selectedDateTime < now
  }

  const handleMultiDayToggle = (checked) => {
    setIsMultiDay(checked)
    if (!checked) {
      setEndDate(startDate)
    }
  }

  const handleSave = () => {
    const now = new Date()
    const startDateTime = moment(startDate)
      .set({
        hour: Number.parseInt(startTime.split(":")[0]),
        minute: Number.parseInt(startTime.split(":")[1]),
      })
      .toDate()

    // Check if the date is in the past (ignoring time)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDate < today) {
      toast.warning("Cannot create events for past dates", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    // If it's today, check the time isn't in the past
    if (moment(startDate).isSame(moment(), "day") && isPastDateTime(startDate, startTime)) {
      toast.warning("Cannot create events in the past for today", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    // Validate that end time is not before start time
    if (!isMultiDay && moment(`2000-01-01 ${endTime}`).isBefore(moment(`2000-01-01 ${startTime}`))) {
      toast.warning("End time cannot be before start time", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    const modifiedEvent = {
      ...event,
      title: eventTitle,
      start: startDateTime,
      end: isMultiDay
        ? moment(endDate)
            .set({
              hour: Number.parseInt(endTime.split(":")[0]),
              minute: Number.parseInt(endTime.split(":")[1]),
            })
            .add(1, "days")
            .toDate()
        : moment(endDate)
            .set({
              hour: Number.parseInt(endTime.split(":")[0]),
              minute: Number.parseInt(endTime.split(":")[1]),
            })
            .toDate(),
      isMultiDay,
    }

    onModify(modifiedEvent)
    onClose()
  }

  if (!isOpen) return null

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button ref={ref} className="inputBox text-left" onClick={onClick}>
      {value || "Select date"}
    </button>
  ))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-semibold mb-4 text-left">Modify Schedule</h2>
        <p className="text-sm text-gray-600 mb-6 ml-3 text-left">
          Note: Check the box below to make it a multi-day event.
        </p>

        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Date:</span>
            <div className="flex-1 flex justify-end items-center space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  if (!isMultiDay) setEndDate(date)
                }}
                customInput={<CustomInput />}
                minDate={new Date()} // Prevent selecting past dates
              />
              {isMultiDay && (
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  customInput={<CustomInput />}
                />
              )}
            </div>
          </div>

          <div className="flex items-center mt-2">
            <span className="w-32 text-sm font-medium">Multi-day:</span>
            <input
              type="checkbox"
              checked={isMultiDay}
              onChange={(e) => handleMultiDayToggle(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>

          {!isMultiDay && (
            <div className="flex items-center mt-2">
              <span className="w-32 text-sm font-medium">Operating Time:</span>
              <div className="flex space-x-4">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    const newTime = e.target.value
                    // Only validate time if it's today
                    if (moment(startDate).isSame(moment(), "day")) {
                      if (isPastDateTime(startDate, newTime)) {
                        toast.warning("Cannot select a time in the past for today", {
                          position: "bottom-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                        })
                        return
                      }
                    }
                    setStartTime(newTime)

                    // If end time is earlier than new start time, update it
                    if (moment(`2000-01-01 ${newTime}`).isAfter(moment(`2000-01-01 ${endTime}`))) {
                      setEndTime(newTime)
                    }
                  }}
                  className="inputBox"
                  min="06:00"
                  max="19:00"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="inputBox"
                  min={startTime} // Prevent selecting time before start time
                  max="19:00"
                />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <span className="w-32 text-sm font-medium">Event:</span>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter event title"
              className="inputBox"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button className="penBtn" onClick={handleSave}>
            Modify
          </button>
          <button className="cancelModify" onClick={() => onDelete(event)}>
            Delete
          </button>
          <button className="cancelModify" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModifySchedule

