import React from 'react';

const BookingReservation = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Modify Booking Reservation</h2>
        
        <div className="flex gap-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">User ID:</span>
              <input
                type="text"
                defaultValue="1-00923"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.*:</span>
              <input
                type="text"
                defaultValue="2021-2-01090"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Name*:</span>
              <input
                type="text"
                defaultValue="Alexander B. Corrine"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">College*:</span>
              <input
                type="text"
                defaultValue="COECSA"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department*:</span>
              <input
                type="text"
                defaultValue="DCS"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="text-xs text-gray-500 mt-4">*Autofilled data</div>

          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Room:</span>
              <input
                type="text"
                defaultValue="ARC-1"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Date:</span>
              <input
                type="text"
                defaultValue="August 23"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Period:</span>
              <input
                type="text"
                defaultValue="11:00AM-12:00PM"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Status:</span>
              <div className="flex-1 flex justify-end">
                <span className="px-4 py-1 bg-arcadia-yellow text-arcadia-black rounded-full text-sm">
                  Reserved
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Purpose:</span>
              <input
                type="text"
                defaultValue="CS101 Group Study"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Contact No.:</span>
              <input
                type="text"
                defaultValue="09123456789"
                className="flex-1 px-3 py-1.5 bg-gray-100 border rounded-full text-right"
                readOnly
              />
            </div>
          </div>
        </div>

        

        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="px-8 py-2 bg-arcadia-red text-white rounded-full hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Modify
          </button>
          <button
            className="px-8 py-2 border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReservation;