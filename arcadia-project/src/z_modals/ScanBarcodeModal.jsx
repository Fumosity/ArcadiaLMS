import { React, useState } from "react";
import BarcodeScanner from "../components/admin-book-check-in-out-comp/BarcodeScanner";

const ScanBarcodeModal = ({ isOpen, onClose, onScan }) => {
  if (!isOpen) return null;
  const [scannedBarcode, setScannedBarcode] = useState("");

  const handleBarcodeScan = (barcode) => {
    setScannedBarcode(barcode); // Store scanned barcode
    onScan(barcode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Scan Barcode</h2>
        </div>

        <BarcodeScanner onScan={handleBarcodeScan}></BarcodeScanner>

        <div className="flex justify-between space-x-2">
          <input
            type="text"
            placeholder="Extracted Barcode No."
            value={scannedBarcode}
            readOnly
            className="px-3 py-1 rounded-lg border border-grey w-2/3 hover:bg-light-gray transition"
          />
          <button
            className="px-3 py-1 rounded-lg border border-grey w-1/3 hover:bg-arcadia-red hover:text-white hover:border-arcadia-red transition"
            onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanBarcodeModal;
