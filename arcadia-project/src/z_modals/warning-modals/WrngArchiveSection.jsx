const WrngArchiveSection = ({ isOpen, onClose, onConfirm, itemName, isArchived }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {isArchived ? "Restore Section" : "Archive Section"}
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {isArchived ? "restore" : "archive"} the section "{itemName}"?
          {!isArchived && " This will hide it from the main list but preserve all data."}
          {isArchived && " This will make it visible in the main list again."}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-grey rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 border border-grey text-black rounded transition-colors ${
              isArchived ? " hover:bg-arcadia-red hover:text-white" : "hover:bg-arcadia-red hover:text-white"
            }`}
          >
            {isArchived ? "Restore" : "Archive"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WrngArchiveSection
