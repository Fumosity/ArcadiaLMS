const SelectFormat = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Export file as?</h2>
        <div className="flex justify-center space-x-4">
          <button className="genWhiteButtons text-white hover:bg-red-700" onClick={() => onExport("xlsx")}>
            XLSX
          </button>
          <button className="genWhiteButtons text-white hover:bg-red-700" onClick={() => onExport("csv")}>
            CSV
          </button>
          <button className="genRedBtns bg-arcadia-red text-white" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectFormat;
