import { useEffect, useState } from "react"
import Title from "../components/main-comp/Title"
import { useNavigate } from "react-router-dom" // Import useNavigate
import SectionList from "./SectionList"
import SectionView from "../components/admin-section-mgmt-comp/SectionView"
import ASAdding from "../components/admin-section-mgmt-comp/ASAdding"
import ASModifying from "../components/admin-section-mgmt-comp/ASModifying"
import { supabase } from "../supabaseClient"

export default function ALibSecMgmt() {
  useEffect(() => {
    document.title = "Arcadia | Library Section Management"
  }, [])
  const navigate = useNavigate() // Initialize useNavigate
  const [selectedSection, setSelectedSection] = useState(null) // State to hold the selected book details
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [isModifyingSection, setIsModifyingSection] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const [formData, setFormData] = useState({
    sectionStandard: "",
    sectionClass: "",
    sectionClassDesc: "",
    sectionSubclass: "",
    sectionSubclassDesc: "",
  })
  const [sections, setSections] = useState([])

  // Fetch sections
  const fetchSections = async () => {
    try {
      const { data: sectionData, error: sectionError } = await supabase
        .from("library_sections")
        .select("*")
        .order("sectionID", { ascending: true })

      if (sectionError) throw sectionError

      // Make sure all sections have the isarchived field
      const processedSections = sectionData.map((section) => ({
        ...section,
        isarchived: section.isarchived || false,
      }))

      setSections(processedSections)
      console.log(processedSections)

    } catch (error) {
      console.error("Error fetching sections:", error.message)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleSectionSelect = (section) => {
    setIsAddingSection(false)
    setSelectedSection(section)
  }

  const handleModifySection = (section) => {
    setSelectedSection(section)
    setIsModifyingSection(true)
    setIsAddingSection(false)
  }

  const handleSectionDeleted = (section) => {
    if (section === null) {
      // Section deleted, clear selection and refresh list
      setSelectedSection(null)
      fetchSections()
      setIsAddingSection(false)
      setIsModifyingSection(false)
    } else {
      // If needed, handle other logic (like for modify)
      setSelectedSection(section)
    }
  }

  const toggleShowArchived = () => {
    setShowArchived(!showArchived)
  }

  return (
    <div className="bg-white">
      <Title>Section Management</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12 min-h-[85vh]">
        <div className="flex-shrink-0 w-2/4">
          <div className="flex justify-between w-full gap-2 h-fit">
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate("/admin/useraccounts")}
            >
              Return to User Accounts
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => {
                setIsAddingSection(true), setIsModifyingSection(false)
              }}
            >
              Add a Section
            </button>
          </div>
          <div className="flex justify-between w-full gap-2 h-full">
            <SectionList
              sections={sections}
              onSectionSelect={handleSectionSelect}
              fetchSections={fetchSections}
              showArchived={showArchived}
              onToggleArchived={toggleShowArchived}
            />
          </div>
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-2/4">
          <div className="w-full">
            {isAddingSection ? (
              <ASAdding
                formData={formData}
                setFormData={setFormData}
                refreshSections={fetchSections}
                isModifying={isModifyingSection}
              />
            ) : isModifyingSection ? (
              <ASModifying
                formData={formData}
                setFormData={setFormData}
                selectedSection={selectedSection} // Corrected the variable name
                refreshSections={fetchSections}
                onReturn={() => setIsModifyingSection(false)} // Properly set the state to false
              />
            ) : (
              <SectionView
                section={selectedSection}
                onSectionDeleted={handleSectionDeleted} // for deletions
                onModifySection={handleModifySection} // for modifications
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
