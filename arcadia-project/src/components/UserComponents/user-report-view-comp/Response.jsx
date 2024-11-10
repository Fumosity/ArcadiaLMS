import React from "react";

const Response = () => {
    return (

            <div>
            <h3 className="text-lg font-semibold mb-4">Response</h3>
            <div className="items-center">
                <label className="text-sm font-semibold mr-2">Most Recent Reply:</label>
                <textarea
                className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
                placeholder="Greetings in Veritas and Fortitudo. Thank you for making this report. The issue has since been resolved."
            ></textarea>
            </div>

            </div>
            
            

    )
};

export default Response;