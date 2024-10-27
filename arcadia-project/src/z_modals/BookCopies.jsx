import React from 'react';

const BookCopiesTableModal = ({ isOpen, onClose }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-300 text-lime-950';
      case 'Reserved':
        return 'bg-amber-200 text-yellow-950';
      case 'Damaged':
        return 'bg-red-400 text-red-950';
      default:
        return 'bg-green-300 text-lime-950';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg relative">
        
        {/* Use your existing close button design */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <span className="text-lg">&times;</span> {/* You can customize this further */}
        </button>

        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-zinc-900">Book Copies</h2>
        </header>

        <div className="flex flex-col p-2.5 mb-4 rounded-2xl">
          <div className="flex items-center justify-between gap-10 text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <span className="text-black">Sort By:</span>
              <button className="px-2.5 py-0.5 border border-zinc-500 rounded-[40px] text-zinc-500">
                Descending
              </button>
              <span className="text-black">Filter By:</span>
              <button className="px-2.5 py-0.5 border border-zinc-500 rounded-[40px] w-[75px] text-zinc-500">
                Status
              </button>
              <button className="px-2.5 py-0.5 border border-zinc-500 rounded-[40px] w-[75px]">
                Date Acq.
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <label htmlFor="search" className="text-black">Search:</label>
              <div className="flex items-center px-2.5 py-0.5 border border-zinc-500 rounded-[40px] w-[200px]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/599129c991b79eb76218ab85a30dde5f762c925bee162f4719777701fe8fee67?placeholderIfAbsent=true&apiKey=620028e28bca4cb69d65313d900a8f5f"
                  alt="Search icon"
                  className="w-4 h-4 object-contain"
                />
                <input
                  id="search"
                  type="text"
                  placeholder="An ID or Call No."
                  className="bg-transparent border-none outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center text-base font-bold text-zinc-900">
            <span className="w-[100px]">Book ID</span>
            <span className="w-[150px]">Call No.</span>
            <span className="w-[100px]">Status</span>
            <span className="w-[100px]">Date Acq.</span>
          </div>

          <div className="mt-2.5 border-t border-zinc-300" />

          {[
            { id: '123456', callNo: 'LPUCAV-0023918', status: 'Available', dateAcq: '2021' },
            { id: '123457', callNo: 'LPUCAV-0023919', status: 'Available', dateAcq: '2022' },
            { id: '123458', callNo: 'LPUCAV-0023920', status: 'Reserved', dateAcq: '2021' },
            { id: '123459', callNo: 'LPUCAV-0023921', status: 'Damaged', dateAcq: '2021' }
          ].map((book, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center gap-10 text-base text-zinc-900">
                <span className="w-[100px]">{book.id}</span>
                <span className="w-[150px]">{book.callNo}</span>
                <span className={`px-5 rounded-3xl w-[100px] ${getStatusStyle(book.status)}`}>
                  {book.status}
                </span>
                <span className="w-[100px]">{book.dateAcq}</span>
              </div>
              <div className="mt-2.5 border-t border-zinc-300" />
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center items-center gap-6 mt-2.5 min-h-[50px]">
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Add a Book
          </button>
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Remove a Book
          </button>
          <button className="px-2.5 py-1.5 border border-zinc-900 rounded-[40px] w-[135px]">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCopiesTableModal;
