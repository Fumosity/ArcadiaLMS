import React from "react";

const MakeReport = () => {
    return (
        <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">

            <h3 className="text-lg font-semibold mb-4">Make a Report</h3>
            <div className="flex items-center mb-4">
                <label className="text-sm mr-2 font-semibold">Type:</label>
                <select
                    className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
                    defaultValue="select-type"
                >
                    <option value="select-type" className="text-center text-grey">Select Type</option>
                    <option value="system" className="text-center">System</option>
                    <option value="book" className="text-center">Book</option>
                    <option value="feedback" className="text-center">Research</option>
                </select>

                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg
                        className="w-4 h-4 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </span>

                <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
                <input
                    type="text"
                    className="flex-1 px-2 py-1 border border-grey rounded-full text-sm"
                    placeholder="Enter the subject of the report here."
                />
            </div>
            <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
            <textarea
                className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
                placeholder="Enter the content of the report here. Be as specific as possible regarding the context, location, and coverage so that we can immediately rectify the problem."
            ></textarea>
            <p className="text-xs text-gray-500 mb-4">
                In addition to the contents above, your account information will also be included when making a report. By pressing the button below, you
                hereby agree that everything that you have written above is factual and current, and that the abuse of this function may result in
                disciplinary action against your account.
            </p>
            <div className="flex justify-center">
                <button className="px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red">
                    Make a report
                </button>
            </div>

        </div>
    )
};

export default MakeReport;