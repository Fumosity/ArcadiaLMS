import { useState, useEffect } from "react"

const ModifyAbstract = ({ isOpen, onClose, onModify, initialAbstract, isUpdating = false }) => {
  const [abstractContent, setAbstractContent] = useState("")

  useEffect(() => {
    if (isOpen) {
      setAbstractContent(initialAbstract || "")
    }
  }, [isOpen, initialAbstract])

  if (!isOpen) return null

  const handleChange = (e) => {
    setAbstractContent(e.target.value)
  }

  const handleModify = () => {
    onModify(abstractContent)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl h-[500px] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modify Abstract</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
            disabled={isUpdating}
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
            Abstract Content:
          </label>
          <textarea
            id="abstract"
            value={abstractContent}
            onChange={handleChange}
            className="w-full min-h-[300px] max-h-[300px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y"
            disabled={isUpdating}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="penBtn"
            onClick={handleModify}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Modify"}
          </button>
          <button
            className="cancelModify"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModifyAbstract

