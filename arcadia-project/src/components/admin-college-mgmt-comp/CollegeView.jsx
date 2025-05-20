import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import WrngDeleteCollege from "../../z_modals/warning-modals/WrngDeleteCollege"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

const CollegeView = ({ college, onCollegeDeleted, onModifyCollege }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [deptLoading, setDeptLoading] = useState(true)
  const [deptError, setDeptError] = useState(null)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    if (college) {
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [college])

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!college) return
      setDeptLoading(true)
      try {
        // Only fetch departments if the college is not archived or if we're explicitly viewing an archived college
        if (!college.isarchived || (college.isarchived && showArchived)) {
          const { data: deptData, error: deptError } = await supabase
            .from("department_list")
            .select("*")
            .eq("collegeID", college.collegeID)

          if (deptError) throw deptError

          // Check if there are no departments and set a message if empty
          if (deptData.length === 0) {
            setDepartments([{ departmentName: "No departments available", departmentAbbrev: "-" }])
          } else {
            setDepartments(deptData)
          }
        } else {
          // If college is archived and we're not viewing archived colleges, show a message
          setDepartments([{ departmentName: "Departments hidden (college is archived)", departmentAbbrev: "-" }])
        }
      } catch (error) {
        setDeptError("An error occurred while loading departments.")
      } finally {
        setDeptLoading(false)
      }
    }
    fetchDepartments()
  }, [college, showArchived])

  if (!college) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a college to view its details.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border mt-12">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const collegeDetails = {
    name: college.collegeName,
    abbreviation: college.college,
    status: college.isarchived ? "Archived" : "Active",
  }

  const handleModifyCollege = () => {
    if (college) {
      onModifyCollege(college) // Pass the selected college data to the parent
    }
  }

  const handleDeleteCollege = () => {
    setIsDeleteModalOpen(true)
  }

  const handleArchiveCollege = () => {
    setIsArchiveModalOpen(true)
  }

  const confirmDeleteCollege = async () => {
    try {
      // Only allow deletion if the college is archived
      if (!college.isarchived) {
        toast.error("College must be archived before it can be deleted.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        })
        setIsDeleteModalOpen(false)
        return
      }

      // Delete departments first
      const { error: deptError } = await supabase.from("department_list").delete().eq("collegeID", college.collegeID)

      if (deptError) throw deptError

      // Then delete college
      const { error } = await supabase.from("college_list").delete().eq("collegeID", college.collegeID)

      if (error) throw error

      setIsDeleteModalOpen(false)
      toast.success("College and its departments successfully deleted.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      })

      // Notify parent that college was deleted (clear selection and refresh)
      onCollegeDeleted(null)
    } catch (error) {
      alert("An unexpected error occurred while deleting the college.")
      setIsDeleteModalOpen(false)
    }
  }

  const confirmArchiveCollege = async () => {
    try {
      // Toggle the archive status
      const { error } = await supabase
        .from("college_list")
        .update({ isarchived: !college.isarchived })
        .eq("collegeID", college.collegeID)

      if (error) throw error

      setIsArchiveModalOpen(false)

      const message = college.isarchived ? "College successfully restored." : "College successfully archived."

      toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      })

      // Update the college object with the new archive status
      const updatedCollege = { ...college, isarchived: !college.isarchived }

      // Reset showArchived when archiving a college
      if (!college.isarchived) {
        setShowArchived(false)
      }

      onCollegeDeleted(updatedCollege)
    } catch (error) {
      alert(`An unexpected error occurred while ${college.isarchived ? "restoring" : "archiving"} the college.`)
      setIsArchiveModalOpen(false)
    }
  }

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyCollege}
        >
          Modify Selected College
        </button>
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleArchiveCollege}
        >
          {college.isarchived ? "Restore College" : "Archive College"}
        </button>
        {college.isarchived && (
          <button
            className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
            onClick={handleDeleteCollege}
          >
            Delete College
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
        <h3 className="text-2xl font-semibold mb-4">College Information</h3>

        <div className="mb-2 w-full">
          <h4 className="text-xl font-semibold mb-4">Overview</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(collegeDetails).map(([key, value]) => (
              <div className="flex w-full gap-4" key={key}>
                <label className="w-1/4 px-1 py-1 capitalize">{key}:</label>
                <div
                  className={`w-3/4 px-3 py-1 rounded-full border border-grey ${key === "status" && (value === "Archived" ? "bg-gray-100" : "bg-green-50")}`}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold">Departments</h4>
            {college.isarchived && (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={() => setShowArchived(!showArchived)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arcadia-red"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  {showArchived ? "Showing Departments" : "Show Departments"}
                </span>
              </label>
            )}
          </div>
          {deptLoading ? (
            <p>Loading departments...</p>
          ) : deptError ? (
            <p>{deptError}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Abbreviation
                  </th>
                  <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr className="hover:bg-light-gray cursor-pointer border-b border-grey" key={dept.departmentAbbrev}>
                    <td className="w-1/3 px-4 py-2 text-center text-sm">{dept.departmentAbbrev}</td>
                    <td className="w-2/3 px-4 py-2 text-sm">{dept.departmentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <WrngDeleteCollege
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCollege}
        itemName={college.college}
      />

      {/* Archive Confirmation Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{college.isarchived ? "Restore College" : "Archive College"}</h2>
            <p className="mb-6">
              {college.isarchived
                ? `Are you sure you want to restore the college "${college.collegeName}"? This will make it visible to users again.`
                : `Are you sure you want to archive the college "${college.collegeName}"? This will hide it from users but keep it in your database.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 border border-grey rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchiveCollege}
                className="px-4 py-2 bg-arcadia-red hover:bg-grey hover:text-black text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {college.isarchived ? "Restore" : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeView
