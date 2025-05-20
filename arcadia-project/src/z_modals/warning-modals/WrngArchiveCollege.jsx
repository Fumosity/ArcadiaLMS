
const WrngArchiveCollege = ({ isOpen, onClose, onConfirm, itemName, isArchived }) => {
  if (!isOpen) return null

  const action = isArchived ? "restore" : "archive"
  const actionCapitalized = isArchived ? "Restore" : "Archive"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{actionCapitalized} College</h2>
        <p className="mb-6">
          {isArchived
            ? `Are you sure you want to restore the college "${itemName}"? This will make it visible to users again.`
            : `Are you sure you want to archive the college "${itemName}"? This will hide it from users but keep it in your database.`}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-grey rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-arcadia-red hover:bg-grey hover:text-black text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {actionCapitalized}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WrngArchiveCollege
