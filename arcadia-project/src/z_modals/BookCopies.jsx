import React from 'react';

const BookCopies = ({ isOpen, onClose, bookCopies = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green text-lime-950';
      case 'Reserved':
        return 'bg-yellow text-yellow-950';
      case 'Damaged':
        return 'bg-red text-red-950';
      default:
        return 'bg-green text-lime-950';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg relative">
  
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <span className="text-lg">&times;</span>
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

          {bookCopies.map((book, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center gap-10 text-base text-zinc-900 mt-3">
                <span className="w-[100px]">{book.bookID}</span>
                <span className="w-[150px]">{book.arcID}</span>
                <span className={`px-5 rounded-3xl w-[100px] ${getStatusStyle('Available')}`}>
                  Available {/* Hardcoded status for now */}
                </span>
                <span className="w-[100px]">{book.currentPubDate}</span>
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

export default BookCopies;
