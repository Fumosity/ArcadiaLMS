import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient.js"
import { v4 as uuidv4 } from "uuid"
import { addResearch, newThesisIDGenerator } from "../../backend/ARAddBackend.jsx"
import ResearchUploadModal from "../../z_modals/ResearchUploadModal"
import { GlobalWorkerOptions } from "pdfjs-dist"
import { toast } from "react-toastify"

// Set the worker source explicitly
GlobalWorkerOptions.workerSrc = "/pdfjs-dist/pdf.worker.min.mjs"

//Main Function
const ARAdding = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Define the error style for validation
  const errorStyle = { border: "2px solid red" }

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

  const currentYear = (new Date().getFullYear()) + 10;

  //Aggregates form inputs
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

  const updateDepartmentOptions = (college) => {
    // Assuming `collegeDepartmentMap` contains the mapping from college to an array of departments
    const options = collegeDepartmentMap[college] || []

    setDepartmentOptions(options)

    // If the currently selected department is no longer valid for the new college, reset it
    setFormData((prevData) => ({
      ...prevData,
      department: options.includes(prevData.department) ? prevData.department : "", // reset department if invalid
    }))
  }

  // Separate function to handle file uploads
  const handleFileSelect = async (files) => {
    console.log("Files received in handleFileSelect:", files)

    if (!Array.isArray(files)) {
      setUploadedFiles([])
      return
    }

    setUploadedFiles(files)
    setValidationErrors((prevErrors) => ({ ...prevErrors, files: false }))
  }

  // Function to handle extracted data and update formData
  const handleExtractedData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
      college: data.college,
      department: data.department, // Ensure department is set from extracted data if available
    }))
    updateDepartmentOptions(data.college) // Ensure department options are updated when data is autofilled
  }

  //Handles the submission to the database
  const handleSubmit = async () => {
    // Define base required fields without department
    const baseRequiredFields = [
      "title",
      "author",
      "college",
      "abstract",
      "keywords",
      "pubDate",
      "location",
      "researchID",
      "researchCallNum",
    ]

    // Add department to required fields only if college is COECSA or IS
    const requiredFields = [...baseRequiredFields]
    if (formData.college === "COECSA" || formData.college === "IS") {
      requiredFields.push("department")
    }

    // Ensure formData is fully updated
    const updatedFormData = { ...formData } // Capture current formData

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => {
      const value = updatedFormData[field]

      // Check if the value is an array
      if (Array.isArray(value)) {
        return value.length === 0 || (value.length === 1 && value[0] === "")
      }

      // Check if the value is a string or other type
      return !value || (typeof value === "string" && !value.trim())
    })

    if (missingFields.length > 0) {
      const newValidationErrors = {}
      missingFields.forEach((field) => {
        newValidationErrors[field] = true
      })
      setValidationErrors(newValidationErrors)

      toast.error("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    setIsSubmitting(true)
    const pdfUrls = []
    const imageUrls = []

    try {
      // Handle file uploads if there are any, but don't require them
      if (Array.isArray(uploadedFiles) && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const filePath = `${uuidv4()}_${file.name}`
          const { error } = await supabase.storage.from("research-files").upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

          if (error) {
            console.error("Error uploading file: ", error)
            throw new Error(`Error uploading file: ${error.message}`)
          } else {
            const { data: publicData, error: urlError } = supabase.storage.from("research-files").getPublicUrl(filePath)
            if (urlError) {
              console.error("Error getting public URL: ", urlError.message)
              throw new Error(`Error getting public URL: ${urlError.message}`)
            } else {
              if (file.type === "application/pdf") {
                pdfUrls.push(publicData.publicUrl)
              } else if (file.type.startsWith("image/")) {
                imageUrls.push(publicData.publicUrl)
              }
            }
          }
        }
      }

      const updatedFormDataWithFiles = {
        ...formData,
        pdf: pdfUrls.join(", "),
        images: imageUrls.join(", "),
      }

      const success = await addResearch(updatedFormDataWithFiles)

      if (success) {
        toast.success("Research added successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        })

        setFormData({
          researchID: "",
          title: "",
          author: [],
          college: "",
          department: "",
          abstract: "",
          keywords: [],
          location: "",
          researchCallNum: "",
          pubDate: "",
          pdf: "",
          images: "",
        })

        setUploadedFiles([])
        await newThesisIDGenerator({}, setFormData)
      } else {
        toast.error("Failed to add research. Please try again.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        })
      }
    } catch (error) {
      console.error("Error in submission process:", error)
      toast.error(`Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  //Generate a new researchID
  useEffect(() => {
    newThesisIDGenerator(formData, setFormData)
  }, [])

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

  //Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Research Adding</h2>
        <div className="flex">
          {/* Left Side: Form Section */}
          <div className="w-full">
            <p className="text-gray-600 mb-8">Use a semicolon (;) or comma (,) to add multiple authors and keywords.</p>

            <div className="flex-col justify-between items-center mb-6 space-y-2">
              <div className="flex justify-start w-full">
                <button
                  className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg hover:bg-light-gray transition border-grey"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upload Pages to Autofill (Optional)
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
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Full Research Title"
                      style={validationErrors.title ? errorStyle : {}}
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Authors:</label>
                    <input
                      type="text"
                      name="author"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Author 1; Author 2; Author 3;..."
                      style={validationErrors.author ? errorStyle : {}}
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Program:</label>
                    <div className="select-dropdown-wrapper w-2/3">
                      <select
                        name="college"
                        className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
                        value={formData.college}
                        style={validationErrors.college ? errorStyle : {}}
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
                  {formData.college === "COECSA" || formData.college === "IS" ? (
                    <div className="flex justify-between items-center">
                      <label className="w-1/4">{formData.college === "COECSA" ? "Department:" : "Grade Level:"}</label>
                      <div className="select-dropdown-wrapper w-2/3">
                        <select
                          name="department"
                          className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
                          value={formData.department}
                          style={validationErrors.department ? errorStyle : {}}
                          onChange={handleChange}
                          required={formData.college === "COECSA" || formData.college === "IS"}
                        >
                          <option value="">
                            {formData.college === "COECSA" ? "Select a department" : "Select level"}
                          </option>
                          {departmentOptions.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Keywords:</label>
                    <input
                      type="text"
                      name="keywords"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.keywords}
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
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Shelf Location"
                      style={validationErrors.location ? errorStyle : {}}
                      required
                      disabled
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Call Number:</label>
                    <input
                      type="text"
                      name="researchCallNum"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.researchCallNum}
                      onChange={handleChange}
                      placeholder="ARC Issued ID, eg. CITHM-123"
                      style={validationErrors.researchCallNum ? errorStyle : {}}
                      required
                    />
                  </div>
                  <div className="justify-between items-center hidden">
                    <label className="w-1/4">Database ID*:</label>
                    <input
                      type="number"
                      name="researchID"
                      className="w-2/3 px-3 py-1 rounded-full border border-grey"
                      value={formData.researchID}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-1/2 space-y-2">
                  <label className="w-1/4 h-8">Abstract:</label>
                  <textarea
                    type="text"
                    name="abstract"
                    className="w-full px-3 py-1 rounded-2xl border border-grey min-h-72"
                    value={formData.abstract}
                    onChange={handleChange}
                    placeholder="Full Abstract Text"
                    style={validationErrors.abstract ? errorStyle : {}}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            {isSubmitting ? "Submitting..." : "Add Research"}
          </button>
        </div>
      </div>

      <ResearchUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
        onExtractedData={handleExtractedData} // For autofill data
      />
    </div>
  )
}

export default ARAdding
