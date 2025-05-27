import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ASAdding = ({ formData, setFormData, refreshSections, isModifying }) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [departments, setDepartments] = useState([{ name: "", abbrev: "" }])
  const [availableClassesForStandard, setAvailableClassesForStandard] = useState([])
  const [isNewClassInput, setIsNewClassInput] = useState(false)

  useEffect(() => {
    if (!formData || typeof formData !== "object") {
      setFormData({
        sectionStandard: "LOC",
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      })
    }
  }, [formData, setFormData])

  useEffect(() => {
    if (!isModifying) {
      setFormData({
        sectionStandard: "LOC",
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      })
      setIsNewClassInput(false)
    }
  }, [isModifying, setFormData])

  useEffect(() => {
    const fetchClasses = async () => {
      if (formData.sectionStandard) {
        try {
          const { data, error } = await supabase
            .from("library_sections")
            .select("class")
            .eq("standard", formData.sectionStandard)
            .eq("isarchived", false) // Only fetch non-archived sections

          if (error) {
            console.error("Error fetching classes:", error.message)
            return
          }

          const uniqueClasses = [...new Set(data.map((item) => item.class))].sort()
          setAvailableClassesForStandard(uniqueClasses)

          if (!isModifying) {
            if (uniqueClasses.length > 0 && !uniqueClasses.includes(formData.sectionClass)) {
              setFormData((prev) => ({ ...prev, sectionClass: "" }))
            } else if (uniqueClasses.length === 0) {
              setFormData((prev) => ({ ...prev, sectionClass: "" }))
            }
          }
        } catch (error) {
          console.error("An unexpected error occurred while fetching classes:", error)
        }
      } else {
        setAvailableClassesForStandard([])
        setFormData((prev) => ({ ...prev, sectionClass: "" }))
      }
    }

    fetchClasses()
  }, [formData.sectionStandard, isModifying, setFormData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === "sectionStandard") {
      setFormData((prev) => ({
        ...prev,
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      }))
      setIsNewClassInput(false)
    }
  }

  const handleClassSelect = (e) => {
    const selectedClass = e.target.value
    if (selectedClass === "addNewClass") {
      setIsNewClassInput(true)
      setFormData((prev) => ({ ...prev, sectionClass: "", sectionClassDesc: "" }))
    } else {
      setIsNewClassInput(false)
      setFormData((prev) => ({ ...prev, sectionClass: selectedClass }))
      fetchClassDescription(formData.sectionStandard, selectedClass)
    }
  }

  const fetchClassDescription = async (standard, className) => {
    try {
      const { data, error } = await supabase
        .from("library_sections")
        .select("classDesc")
        .eq("standard", standard)
        .eq("class", className)
        .eq("isarchived", false) // Only fetch from non-archived sections
        .limit(1)

      if (error) {
        console.error("Error fetching class description:", error.message)
        return
      }

      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, sectionClassDesc: data[0].classDesc || "" }))
      } else {
        setFormData((prev) => ({ ...prev, sectionClassDesc: "" }))
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching class description:", error)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setValidationErrors({})

    if (!formData.sectionStandard.trim()) {
      setValidationErrors((prev) => ({ ...prev, sectionStandard: "Standard is required" }))
      setIsSubmitting(false)
      return
    }
    if (!formData.sectionClass.trim()) {
      setValidationErrors((prev) => ({ ...prev, sectionClass: "Section class is required" }))
      setIsSubmitting(false)
      return
    }
    if (!formData.sectionClassDesc.trim()) {
      setValidationErrors((prev) => ({ ...prev, sectionClassDesc: "Section class description is required" }))
      setIsSubmitting(false)
      return
    }

    try {
      let existingRecords = []
      let checkError = null

      if (formData.sectionSubclass.trim()) {
        ;({ data: existingRecords, error: checkError } = await supabase
          .from("library_sections")
          .select("subclass")
          .eq("standard", formData.sectionStandard)
          .eq("subclass", formData.sectionSubclass)
          .eq("isarchived", false)) // Only check non-archived sections
      } else {
        ;({ data: existingRecords, error: checkError } = await supabase
          .from("library_sections")
          .select("class")
          .eq("standard", formData.sectionStandard)
          .eq("class", formData.sectionClass)
          .eq("isarchived", false)) // Only check non-archived sections
      }

      if (checkError) {
        throw checkError
      }

      if (existingRecords && existingRecords.length > 0) {
        if (formData.sectionSubclass.trim()) {
          setValidationErrors((prev) => ({
            ...prev,
            sectionSubclass: "A section with this subclass already exists for this standard.",
          }))
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            sectionClass: "A section with this class already exists for this standard (and no subclass was provided).",
          }))
        }
        setIsSubmitting(false)
        return
      }

      const { data: section, error: sectionError } = await supabase
        .from("library_sections")
        .insert([
          {
            standard: formData.sectionStandard,
            class: formData.sectionClass,
            classDesc: formData.sectionClassDesc,
            subclass: formData.sectionSubclass.trim() === "" ? null : formData.sectionSubclass,
            subclassDesc: formData.sectionSubclassDesc.trim() === "" ? null : formData.sectionSubclassDesc,
            isarchived: false, // New sections are active by default
          },
        ])
        .select("sectionID")

      if (sectionError) {
        throw sectionError
      }

      toast.success("Section added successfully!")
      refreshSections()

      setFormData({
        sectionStandard: "LOC",
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      })
      setIsNewClassInput(false)
    } catch (error) {
      console.error("Error adding section: ", error)
      toast.error(`Failed to add section: ${error.message || error.details || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-grey rounded-lg p-4 mt-12 w-full h-fit">
      <h2 className="text-2xl font-semibold mb-4">Add Section</h2>
      <form className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="w-1/3">Standard:</label>
          <select
            type="text"
            name="sectionStandard"
            className="w-2/3 px-3 py-1 rounded-full border border-grey"
            value={formData?.sectionStandard || ""}
            onChange={handleChange}
          >
            <option value={"LOC"}>LOC</option>
            <option value={"DDC"}>DDC</option>
          </select>
          {validationErrors.sectionStandard && (
            <span className="text-red-500 text-sm">{validationErrors.sectionStandard}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Class:</label>
          {isNewClassInput || availableClassesForStandard.length === 0 ? (
            <input
              type="text"
              name="sectionClass"
              className="w-2/3 px-3 py-1 rounded-full border border-grey"
              value={formData?.sectionClass || ""}
              onChange={handleChange}
              placeholder="Enter new Class"
            />
          ) : (
            <select
              name="sectionClass"
              className="w-2/3 px-3 py-1 rounded-full border border-grey"
              value={formData?.sectionClass || ""}
              onChange={handleClassSelect}
            >
              <option value="">-- Select Class or Add New --</option>
              {availableClassesForStandard.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
              <option value="addNewClass">-- Add New Class --</option>
            </select>
          )}
          {validationErrors.sectionClass && (
            <span className="text-red-500 text-sm">{validationErrors.sectionClass}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Class Description:</label>
          <textarea
            name="sectionClassDesc"
            className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
            value={formData?.sectionClassDesc || ""}
            onChange={handleChange}
            disabled={
              !isNewClassInput && formData.sectionClass && availableClassesForStandard.includes(formData.sectionClass)
            }
          />
          {validationErrors.sectionClassDesc && (
            <span className="text-red-500 text-sm">{validationErrors.sectionClassDesc}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Subclass:</label>
          <input
            type="text"
            name="sectionSubclass"
            className="w-2/3 px-3 py-1 rounded-full border border-grey"
            value={formData?.sectionSubclass || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Subclass Description:</label>
          <textarea
            type="text"
            name="sectionSubclassDesc"
            className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
            value={formData?.sectionSubclassDesc || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            {isSubmitting ? "Submitting..." : "Add Section"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ASAdding
