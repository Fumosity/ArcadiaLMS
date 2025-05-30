import { useEffect, useState } from "react"
import PrintReportModal from "../z_modals/PrintTableReport"
import { useUser } from "../backend/UserContext"

export default function SectionList({ onSectionSelect, sections, showArchived = false, onToggleArchived }) {
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [searchTerm, setSearchTerm] = useState("")
  const [standardType, setStandardType] = useState("All")
  const [classType, setClassType] = useState("All")
  const [availableClasses, setAvailableClasses] = useState([])
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [showDDCNotAssigned, setShowDDCNotAssigned] = useState(false)

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  // Effect to populate availableClasses based on sections and standardType
  useEffect(() => {
    if (sections.length > 0) {
      const classes = []
      // Filter sections based on standardType and archive status before extracting classes
      const sectionsToConsider = sections.filter((section) => {
        const matchesStandard = standardType === "All" || section.standard === standardType
        const matchesArchiveStatus = showArchived ? section.isarchived : !section.isarchived
        return matchesStandard && matchesArchiveStatus
      })

      sectionsToConsider.forEach((section) => {
        if (section.class) {
          classes.push(section.class)
        }
      })

      // Remove duplicates and sort
      const uniqueClasses = [...new Set(classes)].sort()
      setAvailableClasses(uniqueClasses)

      // Reset classType if the currently selected class is no longer available
      if (classType !== "All" && !uniqueClasses.includes(classType)) {
        setClassType("All")
      }
    } else {
      setAvailableClasses([])
    }
  }, [sections, standardType, showArchived]) // Re-run when sections, standardType, or showArchived changes

  const handleRowClick = (section) => {
    onSectionSelect(section)
  }

  // --- Filtering and Sorting Logic ---
  const sortedData = [...sections].sort((a, b) => {
    const nameA = a.class || a.subclass || ""
    const nameB = b.class || b.subclass || ""

    if (sortOrder === "Ascending") {
      return nameA.localeCompare(nameB)
    } else {
      return nameB.localeCompare(nameA)
    }
  })

  const filteredData = sortedData.filter((section) => {
    // Filter by archive status
    const matchesArchiveStatus = showArchived ? section.isarchived : !section.isarchived

    // Filter by standard type
    const matchesStandard = standardType === "All" || section.standard === standardType

    // Filter by class type
    const matchesClass = classType === "All" || section.class === classType

    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      (section.name && section.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (section.classDesc && section.classDesc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (section.subclassDesc && section.subclassDesc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (section.class && section.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (section.subclass && section.subclass.toLowerCase().includes(searchTerm.toLowerCase()))

    // New filter: DDC sections where subclass description is "Not assigned or no longer used"
    const matchesDDCNotAssigned =
      !showDDCNotAssigned ||
      (section.standard === "DDC" &&
        section.subclassDesc &&
        section.subclassDesc.toLowerCase().includes("not assigned or no longer used"))

    return matchesArchiveStatus && matchesStandard && matchesClass && matchesSearch && matchesDDCNotAssigned
  })

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
      <div className="flex flex-col justify-between gap-2 mb-4">
        <h3 className="text-2xl font-semibold">List of Library Sections</h3>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Archive Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showArchived"
                checked={showArchived}
                onChange={onToggleArchived}
                className="form-checkbox h-4 w-4 text-arcadia-red rounded"
              />
              <label htmlFor="showArchived" className="font-medium text-sm">
                Show Archived
              </label>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort:</span>
              <button
                onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
                className="sort-by bg-gray-200 border-grey py-1 px-3 rounded-lg text-sm w-28"
              >
                {sortOrder}
              </button>
            </div>

            {/* Standard Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Standard:</span>
              <select
                className="bg-gray-200 py-1 px-1 border border-grey rounded-lg text-sm w-auto"
                value={standardType}
                onChange={(e) => setStandardType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="LOC">LOC</option>
                <option value="DDC">DDC</option>
              </select>
            </div>

            {/* Class Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Class:</span>
              <select
                className="bg-gray-200 py-1 px-1 border border-grey rounded-lg text-sm w-auto"
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                disabled={availableClasses.length === 0}
              >
                <option value="All">All Classes</option>
                {availableClasses.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* New DDC Subclass Description Filter */}
            {standardType === "DDC" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ddcNotAssigned"
                  checked={showDDCNotAssigned}
                  onChange={(e) => setShowDDCNotAssigned(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-arcadia-red rounded"
                />
                <label htmlFor="ddcNotAssigned" className="font-medium text-sm">
                  Show unused
                </label>
              </div>
            )}
          </div>
          <div>
            <button
              className="sort-by bg-arcadia-red hover:bg-white text-white hover:text-arcadia-red font-semibold py-1 px-3 rounded-lg text-sm w-28"
              onClick={() => setIsPrintModalOpen(true)}
            >
              Print Report
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="flex items-center space-x-2 min-w-[0]">
          <label htmlFor="search" className="font-medium text-sm">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[370px]"
            placeholder="Class, subclass, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto border border-x-0 border-dark-gray custom-scrollbar">
        {filteredData.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No sections available.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th className="w-1/8 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th className="w-1/8 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="w-1/4 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Desc
                </th>
                <th className="w-1/8 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subclass
                </th>
                <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subclass Desc
                </th>
                <th className="w-1/8 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((section) => (
                <tr
                  key={section.sectionID}
                  className={`hover:bg-light-gray cursor-pointer border-b border-grey ${
                    section.isarchived ? "bg-gray-50 opacity-75" : ""
                  }`}
                  onClick={() => handleRowClick(section)}
                >
                  <td className="w-1/8 px-4 py-2 text-center text-sm">{section.standard}</td>
                  <td className="w-1/8 px-4 py-2 text-center text-sm">{section.class}</td>
                  <td className="w-1/4 px-4 py-2 text-sm">{section.classDesc}</td>
                  <td className="w-1/8 px-4 py-2 text-center text-sm">{section.subclass}</td>
                  <td className="w-1/3 px-4 py-2 text-sm">{section.subclassDesc}</td>
                  <td className="w-1/8 px-4 py-2 text-center text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        section.isarchived ? "bg-gray-200 text-gray-700" : "bg-green-200 text-green-700"
                      }`}
                    >
                      {section.isarchived ? "Archived" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        filteredData={filteredData}
        reportType={"LibrarySections"}
        filters={{
          standardType,
          classType,
          sortOrder,
          searchTerm,
          showArchived,
        }}
        username={username}
      />
    </div>
  )
}
