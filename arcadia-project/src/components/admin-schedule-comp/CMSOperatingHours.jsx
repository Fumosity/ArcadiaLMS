import { useState } from "react"
import OperatingHoursTable from "./OperatingHoursTable"
import OperatingHoursForm from "./OperatingHoursForm"

export default function CMSOperatingHours() {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div className="rounded-lg border border-grey mt-2 bg-white shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">ARC Operating Hours</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-md bg-arcadia-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-grey hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Edit Hours
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {isEditing 
            ? "Set opening and closing times for each day of the week." 
            : "View and manage the operating hours for the ARC."}
        </p>
      </div>
      <div className="p-6 pt-0">
        {isEditing ? (
          <OperatingHoursForm onCancel={() => setIsEditing(false)} onSuccess={() => setIsEditing(false)} />
        ) : (
          <OperatingHoursTable />
        )}
      </div>
    </div>
  )
}