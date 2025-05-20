import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ACAdding = ({ formData, setFormData, refreshColleges, isModifying }) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [departments, setDepartments] = useState([{ name: "", abbrev: "" }])

  // Initialize formData if not provided
  useEffect(() => {
    if (!formData || typeof formData !== "object") {
      setFormData({
        collegeName: "",
        college: "",
      })
    }
  }, [formData, setFormData])

  useEffect(() => {
    // If not in modify mode, clear the form fields
    if (!isModifying) {
      setFormData({
        collegeName: "",
        college: "",
      })
    }
  }, [isModifying])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addDepartmentRow = (e) => {
    e.preventDefault()
    setDepartments([...departments, { name: "", abbrev: "" }])
  }

  const removeDepartmentRow = (index, e) => {
    e.preventDefault()
    const newDepartments = departments.filter((_, i) => i !== index)
    setDepartments(newDepartments)
  }

  const handleDepartmentChange = (index, field, value) => {
    const newDepartments = [...departments]
    newDepartments[index][field] = value
    setDepartments(newDepartments)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setValidationErrors({})

    // Validate college name and abbreviation
    if (!formData.collegeName.trim()) {
      setValidationErrors((prev) => ({ ...prev, collegeName: "College name is required" }))
      setIsSubmitting(false)
      return
    }
    if (!formData.college.trim()) {
      setValidationErrors((prev) => ({ ...prev, college: "College abbreviation is required" }))
      setIsSubmitting(false)
      return
    }

    try {
      // Check if college with same name or abbreviation already exists
      const { data: existingColleges, error: checkError } = await supabase
        .from("college_list")
        .select("collegeName, college")
        .or(`collegeName.eq.${formData.collegeName},college.eq.${formData.college}`)

      if (checkError) throw checkError

      // If colleges with the same name or abbreviation exist, show error
      if (existingColleges && existingColleges.length > 0) {
        const nameExists = existingColleges.some(
          (c) => c.collegeName.toLowerCase() === formData.collegeName.toLowerCase(),
        )
        const abbrevExists = existingColleges.some(
          (c) => c.college.toLowerCase() === formData.college.toLowerCase(),
        )

        if (nameExists) {
          setValidationErrors((prev) => ({ ...prev, collegeName: "A college with this name already exists" }))
        }

        if (abbrevExists) {
          setValidationErrors((prev) => ({ ...prev, college: "A college with this abbreviation already exists" }))
        }

        setIsSubmitting(false)
        return
      }

      // Filter out blank department rows
      const validDepartments = departments.filter((dept) => dept.name.trim() && dept.abbrev.trim())

      const { data: college, error: collegeError } = await supabase
        .from("college_list")
        .insert([
          {
            collegeName: formData.collegeName,
            college: formData.college,
            isarchived: false,
          },
        ])
        .select("collegeID")

      if (collegeError) throw collegeError

      const collegeID = college[0].collegeID

      if (validDepartments.length > 0) {
        const departmentData = validDepartments.map((dept) => ({
          collegeID,
          departmentName: dept.name,
          departmentAbbrev: dept.abbrev,
        }))

        const { error: deptError } = await supabase.from("department_list").insert(departmentData)
        if (deptError) throw deptError
      }

      toast.success("College and departments added successfully!")
      refreshColleges()

      // Reset form and department fields
      setFormData({ collegeName: "", college: "" })
      setDepartments([{ name: "", abbrev: "" }])
    } catch (error) {
      console.error("Error adding college or departments: ", error)
      toast.error("Failed to add college or departments.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-grey rounded-lg p-4 mt-12 w-full h-fit">
      <h2 className="text-2xl font-semibold mb-4">Add College</h2>
      <form className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="w-1/3">College Name:</label>
          <input
            type="text"
            name="collegeName"
            className="w-2/3 px-3 py-1 rounded-full border border-grey"
            value={formData?.collegeName || ""}
            onChange={handleChange}
          />
          {validationErrors.collegeName && <span className="text-red-500 text-sm">{validationErrors.collegeName}</span>}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">College Abbreviation:</label>
          <input
            type="text"
            name="college"
            className="w-2/3 px-3 py-1 rounded-full border border-grey"
            value={formData?.college || ""}
            onChange={handleChange}
          />
          {validationErrors.college && (
            <span className="text-red-500 text-sm">{validationErrors.college}</span>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">Departments</h3>
        {departments.map((dept, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              className="w-3/4 px-3 py-1 rounded-full border border-grey"
              placeholder="Department Name"
              value={dept.name}
              onChange={(e) => handleDepartmentChange(index, "name", e.target.value)}
            />
            <input
              className="w-1/4 px-3 py-1 rounded-full border border-grey"
              placeholder="Abbreviation"
              value={dept.abbrev}
              onChange={(e) => handleDepartmentChange(index, "abbrev", e.target.value)}
            />
            <button className="px-2 py-1 text-red-500" onClick={(e) => removeDepartmentRow(index, e)}>
              X
            </button>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
            onClick={addDepartmentRow}
          >
            Add Department
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            {isSubmitting ? "Submitting..." : "Add College"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ACAdding
