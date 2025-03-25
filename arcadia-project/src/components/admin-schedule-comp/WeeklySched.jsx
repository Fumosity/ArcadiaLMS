import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import ModifySchedule from "../../z_modals/ModifySchedule"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

const localizer = momentLocalizer(moment)

export default function WeeklySched() {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const fetchSchedule = async () => {
    const { data, error } = await supabase.from("schedule").select("eventID, eventData")

    if (error) {
      console.error("Error fetching schedule:", error)
      toast.error("Failed to load schedule. Please try again later.", {
        position: "bottom-right",
        autoClose: 1500,
      })
      return
    }

    const formattedEvents = data.map((event) => {
      const { event: eventName, start, end, isMultiDay } = event.eventData
      return {
        title: eventName,
        start: moment(start).toDate(),
        end: moment(end).toDate(),
        eventID: event.eventID,
        isMultiDay: isMultiDay || false,
      }
    })

    setEvents(formattedEvents)
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const isPastDateTime = (date) => {
    const now = new Date()
    // For today's date, compare the exact time
    if (moment(date).isSame(moment(), "day")) {
      return date < now
    }
    // For other dates, just compare the date (not time)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleSelect = ({ start, end }) => {
    if (isPastDateTime(start)) {
      toast.warning("Cannot create events in the past", {
        position: "bottom-right",
        autoClose: 1500,
      })
      return
    }

    const event = events.find((e) => e.start.getTime() === start.getTime() && e.end.getTime() === end.getTime())

    if (event) {
      setSelectedEvent(event)
    } else {
      setSelectedEvent({
        title: "New Event",
        start,
        end,
        eventID: null,
        isMultiDay: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleModifySchedule = async (modifiedEvent) => {
    const eventToSave = {
      event: modifiedEvent.title,
      start: moment(modifiedEvent.start).format("YYYY-MM-DD HH:mm"),
      end: moment(modifiedEvent.end).format("YYYY-MM-DD HH:mm"),
      isMultiDay: modifiedEvent.isMultiDay,
    }

    try {
      let updatedEvent
      if (modifiedEvent.eventID) {
        const { data, error } = await supabase
          .from("schedule")
          .update({ eventData: eventToSave })
          .eq("eventID", modifiedEvent.eventID)
          .select()
        if (error) throw error
        updatedEvent = data[0]
        toast.success("Event updated successfully", {
            position: "bottom-right",
            autoClose: 1500,
          })
      } else {
        const { data, error } = await supabase.from("schedule").insert({ eventData: eventToSave }).select()
        if (error) throw error
        updatedEvent = data[0]
        toast.success("Event created successfully", {
            position: "bottom-right",
            autoClose: 1500,
          })
      }

      const formattedEvent = {
        ...modifiedEvent,
        eventID: updatedEvent.eventID,
        start: moment(updatedEvent.eventData.start).toDate(),
        end: moment(updatedEvent.eventData.end).toDate(),
      }

      setEvents((prev) => {
        const existingEventIndex = prev.findIndex((e) => e.eventID === formattedEvent.eventID)
        if (existingEventIndex !== -1) {
          const updatedEvents = [...prev]
          updatedEvents[existingEventIndex] = formattedEvent
          return updatedEvents
        } else {
          return [...prev, formattedEvent]
        }
      })
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Failed to save event. Please try again.", {
        position: "bottom-right",
        autoClose: 1500,
      })
    }

    handleCloseModal()
  }

  const handleDeleteSchedule = async (eventToDelete) => {
    if (!eventToDelete.eventID) {
      console.error("Error: eventID is undefined. Cannot delete event.")
      toast.error("Cannot delete this event. Event hasn't been created yet.", {
        position: "bottom-right",
        autoClose: 1500,
      })
      return
    }

    try {
      const { error } = await supabase.from("schedule").delete().match({ eventID: eventToDelete.eventID })

      if (error) throw error

      setEvents((prev) => prev.filter((event) => event.eventID !== eventToDelete.eventID))
      toast.success("Event deleted successfully", {
        position: "bottom-right",
        autoClose: 1500,
      })
    } catch (err) {
      console.error("Error deleting event:", err)
      toast.error("Failed to delete event. Please try again.", {
        position: "bottom-right",
        autoClose: 1500,
      })
    } finally {
      handleCloseModal()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">Weekly Schedule</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleSelect}
      />
      {isModalOpen && (
        <ModifySchedule
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          onModify={handleModifySchedule}
          onDelete={handleDeleteSchedule}
        />
      )}
    </div>
  )
}

