const SelectFormat = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4">Export file as?</h2>
        <p className="mb-6">Select the format that you want to export</p>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button 
            className="genWhiteButtons text-white hover:bg-red-700 px-4 py-2 rounded" 
            onClick={() => onExport("xlsx")}
          >
            XLSX
          </button>
          <button 
            className="genWhiteButtons text-white hover:bg-red-700 px-4 py-2 rounded" 
            onClick={() => onExport("csv")}
          >
            CSV
          </button>
        </div>
        
        <div className="flex justify-center">
          <button 
            className="penBtn bg-arcadia-red text-white px-4 py-2 rounded" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectFormat;