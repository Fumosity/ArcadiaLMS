export default function CollegeList({ onCollegeSelect, colleges, showArchived = false, onToggleArchived }) {
  const handleRowClick = (college) => {
    onCollegeSelect(college)
  }

  // Filter colleges based on archive status
  const filteredColleges = showArchived ? colleges : colleges.filter((college) => !college.isarchived)

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">List of Colleges</h3>
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => onToggleArchived && onToggleArchived()}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arcadia-red"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {showArchived ? "Showing Archived" : "Show Archived"}
            </span>
          </label>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto border border-x-0 border-dark-gray custom-scrollbar">
        {filteredColleges.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            {showArchived ? "No archived colleges available." : "No active colleges available."}
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abbreviation
                </th>
                <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College Name
                </th>
                <th className="w-1/6 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredColleges.map((college) => (
                <tr
                  key={college.college}
                  className={`hover:bg-light-gray cursor-pointer border-b border-grey ${college.isarchived ? "bg-gray-100" : ""}`}
                  onClick={() => handleRowClick(college)}
                >
                  <td className="w-1/3 px-4 py-2 text-center text-sm">{college.college}</td>
                  <td className="w-2/3 px-4 py-2 text-sm">{college.collegeName}</td>
                  <td className="w-1/6 px-4 py-2 text-center text-sm">
                    {college.isarchived ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Archived
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
