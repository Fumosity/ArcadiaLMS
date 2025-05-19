const WrngDeleteCollege = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center mb-4">
                    <div className="text-red-500 text-2xl mr-2">⚠️</div>
                    <h2 className="text-2xl font-semibold">Attention!</h2>
                </div>
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete the college "{itemName}"? This action cannot be undone.</p>
                <div className="flex justify-center space-x-4">
                    <button className="penBtn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="cancelModify" onClick={onConfirm}>
                        Yes, I am sure
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WrngDeleteCollege

