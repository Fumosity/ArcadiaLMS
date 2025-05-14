import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import Holidays from 'date-holidays'
import { toast } from "react-toastify"

// Generate time options for select dropdown (30 min intervals)
const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const h = hour.toString().padStart(2, "0")
            const m = minute.toString().padStart(2, "0")
            const time = `${h}:${m}`

            // Convert to 12-hour format for display
            const hour12 = hour % 12 || 12
            const ampm = hour >= 12 ? "PM" : "AM"
            const label = `${hour12}:${m} ${ampm}`

            options.push({ value: time, label })
        }
    }
    return options
}

const timeOptions = generateTimeOptions()

export default function OperatingHoursForm({ onCancel, onSuccess }) {
    const [hours, setHours] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [holidays, setHolidays] = useState([])
    const [holidayHours, setHolidayHours] = useState([])
    const [showHolidays, setShowHolidays] = useState(false)
    const [currentYear] = useState(new Date().getFullYear())

    // Fetch regular operating hours
    useEffect(() => {
        async function fetchHours() {
            try {
                const { data, error } = await supabase
                    .from("operating_hours")
                    .select("*")
                    .order("dayOrder")

                if (error) {
                    throw error
                }

                setHours(data || [])
            } catch (error) {
                console.error("Error fetching operating hours:", error)
                toast.error("Failed to load operating hours", {
                    position: "bottom-right",
                    autoClose: 3000
                })
            } finally {
                setLoading(false)
            }
        }

        fetchHours()
    }, [])

    // Fetch holiday hours
    useEffect(() => {
        async function fetchHolidayHours() {
            try {
                const { data, error } = await supabase
                    .from("holiday_hours")
                    .select("*")
                    .order("date")

                if (error) {
                    throw error
                }

                setHolidayHours(data || [])
            } catch (error) {
                console.error("Error fetching holiday hours:", error)
            }
        }

        fetchHolidayHours()
    }, [])

    // Fetch Philippine holidays
    useEffect(() => {
        function fetchPhilippineHolidays() {
            try {
                const hd = new Holidays('PH')
                const yearHolidays = hd.getHolidays(currentYear)

                // Format holidays for display
                const formattedHolidays = yearHolidays.map(holiday => ({
                    id: holiday.date,
                    date: new Date(holiday.date),
                    name: holiday.name,
                    type: holiday.type,
                    formattedDate: new Date(holiday.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }))

                setHolidays(formattedHolidays)
            } catch (error) {
                console.error("Error fetching Philippine holidays:", error)
            }
        }

        fetchPhilippineHolidays()
    }, [currentYear])

    const handleCheckboxChange = (index, checked) => {
        const updatedHours = [...hours]
        updatedHours[index].isClosed = checked
        setHours(updatedHours)
    }

    const handleTimeChange = (index, field, value) => {
        const updatedHours = [...hours]
        updatedHours[index][field] = value
        setHours(updatedHours)
    }

    // Handle holiday hour changes
    const handleHolidayHourChange = (holidayID, field, value) => {
        setHolidayHours(prev =>
            prev.map(h =>
                h.holidayId === holidayID
                    ? { ...h, [field]: value }
                    : h
            )
        )
    }

    // Add a new holiday hour entry
    const addHolidayHours = (holiday) => {
        // Check if this holiday already has hours set
        const existingEntry = holidayHours.find(h => h.holidayId === holiday.id)

        if (existingEntry) return

        const newHolidayHour = {
            holidayId: holiday.id,
            date: holiday.date,
            holiday_name: holiday.name,
            isClosed: true,
            opensAt: null,
            closesAt: null
        }

        setHolidayHours(prev => [...prev, newHolidayHour])
    }

    // Remove holiday hour entry
    const removeHolidayHours = (holidayID) => {
        setHolidayHours(prev => prev.filter(h => h.holidayId !== holidayID))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)

        try {
            // Update regular operating hours
            for (const hour of hours) {
                const { error } = await supabase
                    .from("operating_hours")
                    .update({
                        opensAt: hour.isClosed ? null : hour.opensAt,
                        closesAt: hour.isClosed ? null : hour.closesAt,
                        isClosed: hour.isClosed,
                    })
                    .eq("id", hour.id)

                if (error) throw error
            }

            // Update holiday hours
            for (const holidayHour of holidayHours) {
                // Check if this holiday hour already exists in the database
                const { data: existingData, error: fetchError } = await supabase
                    .from("holiday_hours")
                    .select("id")
                    .eq("holidayId", holidayHour.holidayId)
                    .maybeSingle()

                if (fetchError) throw fetchError

                if (existingData) {
                    // Update existing record
                    const { error } = await supabase
                        .from("holiday_hours")
                        .update({
                            opensAt: holidayHour.isClosed ? null : holidayHour.opensAt,
                            closesAt: holidayHour.isClosed ? null : holidayHour.closesAt,
                            isClosed: holidayHour.isClosed,
                        })
                        .eq("id", existingData.id)

                    if (error) throw error
                } else {
                    // Insert new record
                    const { error } = await supabase
                        .from("holiday_hours")
                        .insert({
                            holidayId: holidayHour.holidayId,
                            date: holidayHour.date,
                            holiday_name: holidayHour.holiday_name,
                            opensAt: holidayHour.isClosed ? null : holidayHour.opensAt,
                            closesAt: holidayHour.isClosed ? null : holidayHour.closesAt,
                            isClosed: holidayHour.isClosed,
                        })

                    if (error) throw error
                }
            }

            // Show success toast and refresh after it closes
            toast.success("Operating hours updated successfully", {
                position: "bottom-right",
                autoClose: 3000,
                onClose: () => {
                    // Refresh the window after toast closes
                    window.location.reload()
                }
            })

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Error updating hours:", error)
            toast.error("Failed to update operating hours", {
                position: "bottom-right",
                autoClose: 3000
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="flex gap-4">
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-grey pb-4">
                <h3 className="text-lg font-medium mb-4">Regular Operating Hours</h3>
                <div className="space-y-4">
                    {hours.map((hour, index) => (
                        <div key={hour.id} className="space-y-2 pb-4 border-b border-grey last:border-0">
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium">{hour.day}</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`closed-${hour.id}`}
                                        checked={hour.isClosed}
                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                        className="h-4 w-4 rounded border-grey text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`closed-${hour.id}`} className="text-sm font-normal">
                                        Closed
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="sr-only">Opening Time</label>
                                    <select
                                        disabled={hour.isClosed}
                                        value={hour.opensAt || ""}
                                        onChange={(e) => handleTimeChange(index, "opensAt", e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-grey bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Opening time</option>
                                        {timeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">Opening time</p>
                                </div>

                                <div>
                                    <label className="sr-only">Closing Time</label>
                                    <select
                                        disabled={hour.isClosed}
                                        value={hour.closesAt || ""}
                                        onChange={(e) => handleTimeChange(index, "closesAt", e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-grey bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Closing time</option>
                                        {timeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">Closing time</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Holiday Hours Section */}
            <div className="border-b border-grey pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Philippine Holiday Hours</h3>
                    <button
                        type="button"
                        onClick={() => setShowHolidays(!showHolidays)}
                        className="text-sm text-black px-2 py-0.5 rounded-full border-grey border hover:text-white hover:bg-red"
                    >
                        {showHolidays ? 'Hide Holidays' : 'Show Holidays'}
                    </button>
                </div>

                {showHolidays && (
                    <div className="space-y-4 mt-4">
                        <p className="text-sm text-gray-500">
                            Set special operating hours for Philippine holidays. If no special hours are set, regular hours will apply.
                        </p>

                        <div className="border border-grey rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Holiday</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Hours</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grey">
                                    {holidays.map(holiday => {
                                        // Find if this holiday has hours set
                                        const holidayHour = holidayHours.find(h => h.holidayId === holiday.id)
                                        const hasHours = !!holidayHour

                                        return (
                                            <tr key={holiday.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-1">{holiday.name}</td>
                                                <td className="px-4 py-1">{holiday.formattedDate}</td>
                                                <td className="px-4 py-1">
                                                    {hasHours ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`holiday-closed-${holiday.id}`}
                                                                checked={holidayHour.isClosed}
                                                                onChange={(e) => handleHolidayHourChange(holiday.id, 'isClosed', e.target.checked)}
                                                                className="h-4 w-4 rounded border-grey text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <label htmlFor={`holiday-closed-${holiday.id}`} className="text-sm font-normal">
                                                                Closed
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-1">
                                                    {hasHours && !holidayHour.isClosed ? (
                                                        <div className="flex items-center space-x-2">
                                                            <select
                                                                value={holidayHour.opensAt || ""}
                                                                onChange={(e) => handleHolidayHourChange(holiday.id, 'opensAt', e.target.value)}
                                                                className="w-24 text-xs border border-grey rounded"
                                                                disabled={holidayHour.isClosed}
                                                            >
                                                                <option value="">Open</option>
                                                                {timeOptions.map(option => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <span>-</span>
                                                            <select
                                                                value={holidayHour.closesAt || ""}
                                                                onChange={(e) => handleHolidayHourChange(holiday.id, 'closesAt', e.target.value)}
                                                                className="w-24 text-xs border border-grey rounded"
                                                                disabled={holidayHour.isClosed}
                                                            >
                                                                <option value="">Close</option>
                                                                {timeOptions.map(option => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : hasHours ? (
                                                        <span className="text-red-600">Closed</span>
                                                    ) : (
                                                        <span className="text-gray-500">Regular hours</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {hasHours ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeHolidayHours(holiday.id)}
                                                            className="text-arcadia-red hover:text-red-800 text-xs"
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => addHolidayHours(holiday)}
                                                            className="text-black border rounded-full border-grey px-1 py-0.5 hover:text-blue-800 text-xs"
                                                        >
                                                            Set Hours
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-md border border-grey bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md bg-arcadia-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-grey hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                >
                    {saving && (
                        <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                        </svg>
                    )}
                    Save Changes
                </button>
            </div>
        </form>
    )
}