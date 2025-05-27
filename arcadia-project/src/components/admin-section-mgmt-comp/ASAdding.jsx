import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const ACAdding = ({ formData, setFormData, refreshSections, isModifying }) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [departments, setDepartments] = useState([{ name: "", abbrev: "" }])
  // New state to store available classes based on the selected standard
  const [availableClassesForStandard, setAvailableClassesForStandard] = useState([]);
  // State to manage if a custom class input is needed (if user wants to add a new class)
  const [isNewClassInput, setIsNewClassInput] = useState(false);

  // Initialize formData if not provided
  useEffect(() => {
    if (!formData || typeof formData !== "object") {
      setFormData({
        sectionStandard: "LOC", // Set a default standard, e.g., "LOC"
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      })
    }
  }, [formData, setFormData])

  useEffect(() => {
    // If not in modify mode, clear the form fields
    if (!isModifying) {
      setFormData({
        sectionStandard: "LOC", // Reset to default "LOC"
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "",
        sectionSubclassDesc: "",
      })
      setIsNewClassInput(false); // Reset new class input
    }
  }, [isModifying, setFormData])

  // Effect to fetch classes based on selected standard
  useEffect(() => {
    const fetchClasses = async () => {
      if (formData.sectionStandard) {
        try {
          const { data, error } = await supabase
            .from("library_sections")
            .select("class")
            .eq("standard", formData.sectionStandard);

          if (error) {
            console.error("Error fetching classes:", error.message);
            return;
          }

          const uniqueClasses = [...new Set(data.map(item => item.class))].sort();
          setAvailableClassesForStandard(uniqueClasses);

          // If the current class in formData isn't in the fetched unique classes,
          // or if it's the first load, set it to the first available or "All"
          // Or, if modifying, keep the existing one.
          if (!isModifying) {
            if (uniqueClasses.length > 0 && !uniqueClasses.includes(formData.sectionClass)) {
              setFormData(prev => ({ ...prev, sectionClass: "" })); // Clear if not found
            } else if (uniqueClasses.length === 0) {
              setFormData(prev => ({ ...prev, sectionClass: "" })); // Clear if no classes
            }
          }

        } catch (error) {
          console.error("An unexpected error occurred while fetching classes:", error);
        }
      } else {
        setAvailableClassesForStandard([]);
        setFormData(prev => ({ ...prev, sectionClass: "" })); // Clear class if no standard selected
      }
    };

    fetchClasses();
  }, [formData.sectionStandard, isModifying, setFormData]); // Re-run when standard changes or modify mode changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If standard changes, reset class and class description
    if (name === "sectionStandard") {
      setFormData(prev => ({
        ...prev,
        sectionClass: "",
        sectionClassDesc: "",
        sectionSubclass: "", // Also reset subclass
        sectionSubclassDesc: "" // And subclass description
      }));
      setIsNewClassInput(false); // Assume not adding a new class initially
    }
  }


  const handleClassSelect = (e) => {
    const selectedClass = e.target.value;
    if (selectedClass === "addNewClass") {
      // User selected to add a new class
      setIsNewClassInput(true);
      setFormData(prev => ({ ...prev, sectionClass: "", sectionClassDesc: "" })); // Clear class and description
    } else {
      // User selected an existing class
      setIsNewClassInput(false);
      setFormData(prev => ({ ...prev, sectionClass: selectedClass }));
      // Optionally, fetch and pre-fill classDesc if available for this class
      fetchClassDescription(formData.sectionStandard, selectedClass);
    }
  };

  const fetchClassDescription = async (standard, className) => {
    try {
      const { data, error } = await supabase
        .from("library_sections")
        .select("classDesc")
        .eq("standard", standard)
        .eq("class", className)
        .limit(1); // Get only one description for the class

      if (error) {
        console.error("Error fetching class description:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, sectionClassDesc: data[0].classDesc || "" }));
      } else {
        setFormData(prev => ({ ...prev, sectionClassDesc: "" })); // Clear if no description found
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching class description:", error);
    }
  };

  const handleSubmit = async () => {
        setIsSubmitting(true);
        setValidationErrors({}); // Clear previous errors

        // --- Frontend Validation ---
        if (!formData.sectionStandard.trim()) {
            setValidationErrors((prev) => ({ ...prev, sectionStandard: "Standard is required" }));
            setIsSubmitting(false);
            return;
        }
        if (!formData.sectionClass.trim()) {
            setValidationErrors((prev) => ({ ...prev, sectionClass: "Section class is required" }));
            setIsSubmitting(false);
            return;
        }
        if (!formData.sectionClassDesc.trim()) {
            setValidationErrors((prev) => ({ ...prev, sectionClassDesc: "Section class description is required" }));
            setIsSubmitting(false);
            return;
        }
        // --- End Frontend Validation ---

        try {
            let existingRecords = [];
            let checkError = null;

            if (formData.sectionSubclass.trim()) {
                // If subclass is provided, check for uniqueness of subclass within the standard
                ({ data: existingRecords, error: checkError } = await supabase
                    .from("library_sections")
                    .select("subclass") // Only need to select 'subclass' for this check
                    .eq("standard", formData.sectionStandard)
                    .eq("subclass", formData.sectionSubclass));
            } else {
                // If no subclass, check for uniqueness of class within the standard
                ({ data: existingRecords, error: checkError } = await supabase
                    .from("library_sections")
                    .select("class") // Only need to select 'class' for this check
                    .eq("standard", formData.sectionStandard)
                    .eq("class", formData.sectionClass));
            }

            if (checkError) {
                throw checkError; // Propagate Supabase query errors
            }

            // Check if any existing record was found
            if (existingRecords && existingRecords.length > 0) {
                if (formData.sectionSubclass.trim()) {
                    setValidationErrors((prev) => ({ ...prev, sectionSubclass: "A section with this subclass already exists for this standard." }));
                } else {
                    setValidationErrors((prev) => ({ ...prev, sectionClass: "A section with this class already exists for this standard (and no subclass was provided)." }));
                }
                setIsSubmitting(false);
                return; // Stop submission if uniqueness check fails
            }

            // --- Proceed with insertion if no conflicts found ---
            const { data: section, error: sectionError } = await supabase
                .from("library_sections")
                .insert([
                    {
                        standard: formData.sectionStandard,
                        class: formData.sectionClass,
                        classDesc: formData.sectionClassDesc,
                        // Store empty subclass/subclassDesc as null in DB if not provided
                        subclass: formData.sectionSubclass.trim() === '' ? null : formData.sectionSubclass,
                        subclassDesc: formData.sectionSubclassDesc.trim() === '' ? null : formData.sectionSubclassDesc,
                    },
                ])
                .select("sectionID"); // Select sectionID to confirm insertion

            if (sectionError) {
                throw sectionError; // Propagate Supabase insertion errors
            }

            toast.success("Section added successfully!");
            refreshSections(); // Inform parent component to refresh its data

            // Reset form fields after successful submission
            setFormData({
                sectionStandard: "LOC", // Reset to default
                sectionClass: "",
                sectionClassDesc: "",
                sectionSubclass: "",
                sectionSubclassDesc: ""
            });
            setIsNewClassInput(false); // Reset new class input mode

        } catch (error) {
            console.error("Error adding section: ", error);
            toast.error(`Failed to add section: ${error.message || error.details || "Unknown error"}`);
        } finally {
            setIsSubmitting(false); // Ensure button is re-enabled regardless of outcome
        }
    };

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
          {validationErrors.sectionStandard && <span className="text-red-500 text-sm">{validationErrors.sectionStandard}</span>}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Class:</label>
          {isNewClassInput || availableClassesForStandard.length === 0 ? (
            // If no existing classes or user wants to add new, show text input
            <input
              type="text"
              name="sectionClass"
              className="w-2/3 px-3 py-1 rounded-full border border-grey"
              value={formData?.sectionClass || ""}
              onChange={handleChange}
              placeholder="Enter new Class"
            />
          ) : (
            // Otherwise, show select dropdown
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
          {validationErrors.sectionClass && <span className="text-red-500 text-sm">{validationErrors.sectionClass}</span>}
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/3">Class Description:</label>
          <textarea
            name="sectionClassDesc"
            className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
            value={formData?.sectionClassDesc || ""}
            onChange={handleChange}
            disabled={!isNewClassInput && formData.sectionClass && availableClassesForStandard.includes(formData.sectionClass)} // Disable if existing class selected
          />
          {validationErrors.sectionClassDesc && <span className="text-red-500 text-sm">{validationErrors.sectionClassDesc}</span>}
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

export default ACAdding
