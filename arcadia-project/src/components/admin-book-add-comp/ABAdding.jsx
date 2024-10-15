import React from "react";

const AABooking = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="flex justify-center items-start p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-8xl flex">
        {/* Booking Section */}
        <div className="w-full">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">Booking</h2>
          
          {/* Booking Details */}
          <div className="self-stretch h-[353px] p-2.5 flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch p-2.5 rounded-[15px] border justify-start items-start gap-2.5 inline-flex">
              <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                {[
                  { label: "Type:", value: "Admin" },
                  { label: "User ID:", value: "1-00923" },
                  { label: "School ID No.:", value: "2021-2-01090" },
                  { label: "Name:", value: "Alexander B. Corrine" },
                  { label: "College:", value: "COECSA" },
                  { label: "Department:", value: "DCS" },
                  { label: "Email:", value: "a.corrine@lpunetwork.edu.ph" },
                ].map(({ label, value }) => (
                  <div className="w-[449px] justify-between items-center inline-flex" key={label}>
                    <label className="text-black text-base font-medium font-['Zen Kaku Gothic Antique']">{label}</label>
                    <input
                      className="h-[27px] px-2.5 py-0.5 rounded-[15px] border border-zinc-300 text-black text-base font-medium font-['Zen Kaku Gothic Antique']"
                      value={value}
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="text-black text-base font-medium font-['Zen Kaku Gothic Antique']">Library Card:</div>
                <div className="self-stretch h-[280px] px-3.5 py-[90px] rounded-[5px] border border-zinc-300 flex-col justify-center items-center gap-2.5 flex">
                  <img className="w-16 h-16" src="https://via.placeholder.com/64x64" alt="Placeholder" />
                  <div className="text-zinc-500 text-base font-medium font-['Zen Kaku Gothic Antique']">Placeholder</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="self-stretch h-[50px] justify-center items-center gap-[25px] inline-flex">
            {["Modify", "Delete", "Blacklist", "Whitelist"].map(action => (
              <div key={action} className="h-[33px] px-2.5 py-[5px] rounded-[40px] border border-zinc-900 justify-center items-center gap-2.5 flex">
                <div className="text-center text-zinc-900 text-base font-medium font-['Zen Kaku Gothic Antique']">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AABooking;
