export default function WrmgDeleteReserve({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 text-red w-14 h-14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete the reservation for {itemName}?
          </h3>
          <div className="flex justify-center gap-4">
            
            <button
              onClick={onClose}
              type="button"
              className="penBtn"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="cancelModify"
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}