import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import WrngDeleteSection from "../../z_modals/warning-modals/WrngDeleteSection"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

const SectionView = ({ section, onSectionDeleted, onModifySection }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  console.log(section)

  useEffect(() => {
    if (section) {
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [section])

  if (!section) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a section to view its details.
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

  const sectionDetails = {
    standard: section.standard,
    class: section.class,
    classDesc: section.classDesc,
    subclass: section.subclass,
    subclassDesc: section.subclassDesc,
  }

  const handleModifySection = () => {
    if (section) {
      onModifySection(section) // Pass the selected section data to the parent
    }
  }

  const handleDeleteSection = () => {
    setIsDeleteModalOpen(true)
  }

  const handleArchiveSection = () => {
    setIsArchiveModalOpen(true)
  }

  const confirmDeleteSection = async () => {
    try {
      // Only allow deletion if the section is archived
      if (!section.isarchived) {
        toast.error("Section must be archived before it can be deleted.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        })
        setIsDeleteModalOpen(false)
        return
      }

      // Delete departments first
      const { error: deptError } = await supabase.from("department_list").delete().eq("sectionID", section.sectionID)

      if (deptError) throw deptError

      // Then delete section
      const { error } = await supabase.from("section_list").delete().eq("sectionID", section.sectionID)

      if (error) throw error

      setIsDeleteModalOpen(false)
      toast.success("Section and its departments successfully deleted.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      })

      // Notify parent that section was deleted (clear selection and refresh)
      onSectionDeleted(null)
    } catch (error) {
      alert("An unexpected error occurred while deleting the section.")
      setIsDeleteModalOpen(false)
    }
  }

  const confirmArchiveSection = async () => {
    try {
      // Toggle the archive status
      const { error } = await supabase
        .from("section_list")
        .update({ isarchived: !section.isarchived })
        .eq("sectionID", section.sectionID)

      if (error) throw error

      setIsArchiveModalOpen(false)

      const message = section.isarchived ? "Section successfully restored." : "Section successfully archived."

      toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      })

      // Update the section object with the new archive status
      const updatedSection = { ...section, isarchived: !section.isarchived }

      // Reset showArchived when archiving a section
      if (!section.isarchived) {
        setShowArchived(false)
      }

      onSectionDeleted(updatedSection)
    } catch (error) {
      alert(`An unexpected error occurred while ${section.isarchived ? "restoring" : "archiving"} the section.`)
      setIsArchiveModalOpen(false)
    }
  }

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifySection}
        >
          Modify Selected Section
        </button>
        {section.isarchived && (
          <button
            className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
            onClick={handleDeleteSection}
          >
            Delete Section
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
        <h3 className="text-2xl font-semibold mb-4">Section Information</h3>

        <div className="mb-2 w-full">
          <h4 className="text-xl font-semibold mb-4">Overview</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(sectionDetails).map(([key, value]) => (
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

      </div>

      {/* Delete Confirmation Modal */}
      <WrngDeleteSection
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSection}
        itemName={section.section}
      />

    </div>
  )
}

export default SectionView
