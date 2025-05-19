import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient.js"
import WrngRmvRsrchInv from "../../z_modals/warning-modals/WrngRmvRsrchInv"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ResearchModify = ({ formData, setFormData, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [validationErrors, setValidationErrors] = useState({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const navigate = useNavigate()

  const collegeDepartmentMap = {
    COECSA: ["DOA", "DCS", "DOE"],
    CLAE: [""],
    CITHM: [""],
    CAMS: [""],
    CON: [""],
    CBA: [""],
    LAW: [""],
    CFAD: [""],
    IS: ["JHS", "SHS"],
    "Graduate School": [""],
  }

  // Format array data for display in form
  const formatArrayForDisplay = (data) => {
    if (!data) return ""
    if (Array.isArray(data)) return data.join("; ")
    return data
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    // Parse keywords and authors properly
    let keywords = queryParams.get("keywords") || ""
    let authors = queryParams.get("author") || ""

    try {
      // Try to parse as JSON if it's stored as a JSON string
      if (keywords && (keywords.startsWith("[") || keywords.startsWith('"'))) {
        keywords = JSON.parse(keywords)
        keywords = formatArrayForDisplay(keywords)
      }

      if (authors && (authors.startsWith("[") || authors.startsWith('"'))) {
        authors = JSON.parse(authors)
        authors = formatArrayForDisplay(authors)
      }
    } catch (e) {
      console.error("Error parsing JSON data:", e)
    }

    const initialFormData = {
      title: queryParams.get("title") || "",
      author: authors,
      college: queryParams.get("college") || "",
      department: queryParams.get("department") || "",
      abstract: queryParams.get("abstract") || "",
      keywords: keywords,
      pubDate: queryParams.get("pubDate") || "",
      location: queryParams.get("location") || "",
      researchID: queryParams.get("researchID") || "",
      researchCallNum: queryParams.get("researchCallNum") || "",
      pages: queryParams.get("pages") || "",
    }

    setFormData(initialFormData)
  }, [location.search, setFormData])

  useEffect(() => {
    if (formData.college) {
      updateDepartmentOptions(formData.college)
    }
  }, [formData.college])

  const currentYear = (new Date().getFullYear()) + 10;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pubDate' && value.length > 4) {
      setFormData({ ...formData, [name]: value.slice(0, 4) });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (value) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  const handleReset = async () => {
    const queryParams = new URLSearchParams(location.search)

    // Parse keywords and authors properly
    let keywords = queryParams.get("keywords") || ""
    let authors = queryParams.get("author") || ""

    try {
      // Try to parse as JSON if it's stored as a JSON string
      if (keywords && (keywords.startsWith("[") || keywords.startsWith('"'))) {
        keywords = JSON.parse(keywords)
        keywords = formatArrayForDisplay(keywords)
      }

      if (authors && (authors.startsWith("[") || authors.startsWith('"'))) {
        authors = JSON.parse(authors)
        authors = formatArrayForDisplay(authors)
      }
    } catch (e) {
      console.error("Error parsing JSON data:", e)
    }

    const initialFormData = {
      title: queryParams.get("title") || "",
      author: authors,
      college: queryParams.get("college") || "",
      department: queryParams.get("department") || "",
      abstract: queryParams.get("abstract") || "",
      keywords: keywords,
      pubDate: queryParams.get("pubDate") || "",
      location: queryParams.get("location") || "",
      researchID: queryParams.get("researchID") || "",
      researchCallNum: queryParams.get("researchCallNum") || "",
      pages: queryParams.get("pages") || "",
    }

    setFormData(initialFormData)
    setValidationErrors({})
    setAttemptedSubmit(false)
  }

  const handleResearchDelete = async () => {
    const researchID = formData.researchID
    if (!researchID) {
      toast.error("No research title selected for deletion.", {
        position: "bottom-right",
        autoClose: 3000,
      })
      return
    }

    try {
      const { error } = await supabase.from("research").delete().eq("researchID", researchID)

      if (error) throw error

      toast.success("Research deleted successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      })

      setTimeout(() => {
        navigate("/admin/researchmanagement")
      }, 2000)
    } catch (error) {
      toast.error(`Failed to delete research: ${error.message}`, {
        position: "bottom-right",
        autoClose: 3000,
      })
    }
  }

  const validateForm = () => {
    const requiredFields = [
      "title",
      "author",
      "college",
      "abstract",
      "keywords",
      "pubDate",
      "location",
      "researchCallNum",
    ]

    const errors = {}
    let isValid = true

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = true
        isValid = false
      }
    })

    // Special validation for department if college is COECSA or IS
    if (
      (formData.college === "COECSA" || formData.college === "IS") &&
      (!formData.department || formData.department.trim() === "")
    ) {
      errors.department = true
      isValid = false
    }

    setValidationErrors(errors)

    if (!isValid) {
      toast.error("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      })
    }

    return isValid
  }

  const handleSave = async () => {
    setAttemptedSubmit(true)

    if (!formData || !formData.researchID) {
      toast.error("Invalid form data or missing research ID", {
        position: "bottom-right",
        autoClose: 3000,
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const { researchID, ...rest } = formData

    // Convert `keywords` and `author` into arrays for JSONB storage
    const processTextToArray = (text) => {
      if (!text) return []
      return Array.isArray(text)
        ? text.map((item) => item.trim()).filter((item) => item !== "")
        : text
            .split(/[,;]+/)
            .map((item) => item.trim())
            .filter((item) => item !== "")
    }

    // Convert array/string values properly
    const updateData = Object.fromEntries(
      Object.entries(rest)
        .filter(([key]) => key !== "category")
        .filter(([key, value]) => !(key === "pages" && (!value || value === ""))) // Skip empty pages field
        .map(([key, value]) => {
          if (key === "keywords" || key === "author") {
            return [key, processTextToArray(value)] // Store as JSONB array
          }
          return [key, value]
        }),
    )

    try {
      const { error } = await supabase.from("research").update(updateData).match({ researchID })

      if (error) throw error

      toast.success("Research updated successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      })

      if (onSave) await onSave(formData)

      setTimeout(() => {
        navigate("/admin/researchmanagement")
      }, 2000)
    } catch (err) {
      console.error("Error updating research:", err)
      toast.error(`Error updating research: ${err.message}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "colored",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateDepartmentOptions = (college) => {
    const options = collegeDepartmentMap[college] || []
    setDepartmentOptions(options)

    setFormData((prevData) => ({
      ...prevData,
      department: options.length > 0 && options.includes(prevData.department) ? prevData.department : "",
    }))
  }

  // Separate function to handle file uploads
  const handleFileSelect = async (files) => {
    console.log("Files received in handleFileSelect:", files)

    if (!Array.isArray(files)) {
      setUploadedFiles([])
      setPageCount(0)
      return
    }

    setUploadedFiles(files)
    setPageCount(files.length)
  }

  const fetchNextCallNumber = async (prefix) => {
    if (!prefix) return ""

    try {
      // Query all call numbers starting with the prefix plus dash
      const { data, error } = await supabase
        .from("research") // <-- adjust table name if different
        .select("researchCallNum")
        .ilike("researchCallNum", `${prefix}-%`)

      if (error) {
        console.error("Error fetching call numbers:", error)
        return ""
      }

      if (!data || data.length === 0) {
        // No existing call numbers, start at 1
        return `${prefix}-1`
      }

      // Extract numbers from existing call numbers, ignoring trailing letters
      const numbers = data
        .map((item) => {
          const callNum = item.researchCallNum
          if (!callNum) return 0
          // Remove prefix and dash, e.g. "DCS-123A" -> "123A"
          const suffix = callNum.slice(prefix.length + 1)
          // Extract numeric part at start
          const match = suffix.match(/^(\d+)/)
          return match ? parseInt(match[1], 10) : 0
        })
        .filter((num) => num > 0)

      if (numbers.length === 0) {
        return `${prefix}-1`
      }

      const maxNumber = Math.max(...numbers)
      return `${prefix}-${maxNumber + 1}`
    } catch (err) {
      console.error("Unexpected error in fetchNextCallNumber:", err)
      return ""
    }
  }

  // Run this effect whenever college or department changes to autofill call number
  useEffect(() => {
    const updateCallNumber = async () => {
      // Priority: department if present, else college
      const prefix = formData.department?.trim() || formData.college?.trim()
      if (!prefix) {
        setFormData((prev) => ({ ...prev, researchCallNum: "" }))
        return
      }

      const nextCallNum = await fetchNextCallNumber(prefix)
      setFormData((prev) => ({
        ...prev,
        researchCallNum: nextCallNum,
      }))
    }

    updateCallNumber()
  }, [formData.college, formData.department])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Research Modify</h2>
        <div className="flex">
          {/* Left Side: Form Section */}
          <div className="w-full">
            <p className="text-gray-600 mb-8">Use a semicolon (;) or comma (,) to add multiple authors and keywords.</p>

            <div className="flex-col justify-between items-center mb-6 space-y-2">
              <div className="flex justify-start w-full">
                <button
                  className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upload Pages to Autofill
                </button>
              </div>
            </div>

            <h3 className="text-xl font-semibold my-2">Research Paper Information</h3>

            <form className="space-y-2">
              <div className="flex justify-between items-start space-x-2">
                <div className="flex-col justify-between items-center w-1/2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Title:</label>
                    <input
                      type="text"
                      name="title"
                      className={`w-2/3 px-3 py-1 rounded-full border ${
                        attemptedSubmit && validationErrors.title ? "border-red border-2" : "border-grey"
                      }`}
                      value={formData.title || ""}
                      onChange={handleChange}
                      placeholder="Full Research Title"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Authors:</label>
                    <input
                      type="text"
                      name="author"
                      className={`w-2/3 px-3 py-1 rounded-full border ${
                        attemptedSubmit && validationErrors.author ? "border-red border-2" : "border-grey"
                      }`}
                      value={formData.author || ""}
                      onChange={handleChange}
                      placeholder="Author 1; Author 2; Author 3;..."
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Program:</label>
                    <div className="select-dropdown-wrapper w-2/3">
                      <select
                        name="college"
                        className={`w-full px-3 py-1 rounded-full border appearance-none ${
                          attemptedSubmit && validationErrors.college ? "border-red border-2" : "border-grey"
                        }`}
                        value={formData.college || ""}
                        onChange={(e) => {
                          handleChange(e)
                          updateDepartmentOptions(e.target.value)
                        }}
                      >
                        <option value="">Select a program</option>
                        {Object.keys(collegeDepartmentMap).map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.college === "COECSA" && (
                    <div className="flex justify-between items-center">
                      <label className="w-1/4">Department:</label>
                      <div className="select-dropdown-wrapper w-2/3">
                        <select
                          name="department"
                          className={`w-full px-3 py-1 rounded-full border appearance-none ${
                            attemptedSubmit && validationErrors.department ? "border-red border-2" : "border-grey"
                          }`}
                          value={formData.department || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select a department</option>
                          {departmentOptions.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {formData.college === "IS" && (
                    <div className="flex justify-between items-center">
                      <label className="w-1/4">High School Level:</label>
                      <div className="select-dropdown-wrapper w-2/3">
                        <select
                          name="department"
                          className={`w-full px-3 py-1 rounded-full border appearance-none ${
                            attemptedSubmit && validationErrors.department ? "border-red border-2" : "border-grey"
                          }`}
                          value={formData.department || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select level</option>
                          {departmentOptions.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Keywords:</label>
                    <input
                      type="text"
                      name="keywords"
                      className={`w-2/3 px-3 py-1 rounded-full border ${
                        attemptedSubmit && validationErrors.keywords ? "border-red border-2" : "border-grey"
                      }`}
                      value={formData.keywords || ""}
                      onChange={handleChange}
                      placeholder="Keyword 1; Keyword 2; Keyword 3;..."
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Year Published:</label>
                    <input
                      type="number"
                      name="pubDate"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.pubDate}
                      onChange={handleChange}
                      min={2000}
                      max={currentYear}
                      placeholder="YYYY"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Location:</label>
                    <input
                      type="text"
                      name="location"
                      className={`w-2/3 px-3 py-1 rounded-full border ${
                        attemptedSubmit && validationErrors.location ? "border-red border-2" : "border-grey"
                      }`}
                      value={formData.location || ""}
                      onChange={handleChange}
                      placeholder="Shelf Location"
                      required
                      disabled
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Call Number:</label>
                    <input
                      type="text"
                      name="researchCallNum"
                      className={`w-2/3 px-3 py-1 rounded-full border ${
                        attemptedSubmit && validationErrors.researchCallNum ? "border-red border-2" : "border-grey"
                      }`}
                      value={formData.researchCallNum || ""}
                      onChange={handleChange}
                      placeholder="ARC Issued ID, eg. CITHM-123"
                      required
                    />
                  </div>
                  <div className="justify-between items-center hidden">
                    <label className="w-1/4">Database ID*:</label>
                    <input
                      type="number"
                      name="researchID"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.researchID || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-1/2 space-y-2">
                  <label className="w-1/4 h-8">Abstract:</label>
                  <textarea
                    name="abstract"
                    className={`w-full px-3 py-1 rounded-2xl border min-h-72 ${
                      attemptedSubmit && validationErrors.abstract ? "border-red border-2" : "border-grey"
                    }`}
                    value={formData.abstract || ""}
                    onChange={handleChange}
                    placeholder="Full Abstract Text"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
            disabled={isSubmitting}
          >
            Reset Changes
          </button>
          <button
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg bg-arcadia-red hover:red text-white"
            onClick={() => setIsModalOpen(true)}
            disabled={isSubmitting}
          >
            Delete Research
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <WrngRmvRsrchInv isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRemove={handleResearchDelete} />
    </div>
  )
}

export default ResearchModify
