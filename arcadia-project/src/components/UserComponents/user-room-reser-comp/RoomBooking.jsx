export default function Component() {
    return (
      <div className="uMain-cont">
  
        <h2 className="text-2xl font-semibold">Booking</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">User ID:</span>
              <input
                type="text"
                placeholder="1-00923"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">School ID No.*:</span>
              <input
                type="text"
                placeholder="2021-2-01090"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Name*:</span>
              <input
                type="text"
                placeholder="Alexander B. Corrine"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">College*:</span>
              <input
                type="text"
                placeholder="COECSA"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Department*:</span>
              <input
                type="text"
                placeholder="DCS"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="text-xs text-dark-gray mt-2">*Autofilled data</div>
          </div>
  
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Room:</span>
              <input
                type="text"
                placeholder="ARC-1"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Date:</span>
              <input
                type="text"
                placeholder="August 23"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Period:</span>
              <input
                type="text"
                placeholder="11:00AM-12:00PM"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Purpose:</span>
              <input
                type="text"
                placeholder="CS101 Group Study"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-dark-gray">Contact No.:</span>
              <input
                type="text"
                placeholder="09123456789"
                className="w-[260px] border border-grey rounded-full px-4 py-2 text-dark-gray"
              />
            </div>
          </div>
        </div>
  
        <div className="flex justify-center mt-12">
          <button className="px-6 py-2 bg-arcadia-red text-white rounded-lg hover:bg-red transition-colors">
            Reserve a Room
          </button>
        </div>
      </div>
    );
  }
  