import React from "react";

const TicketResponse = () => {
    return (

            <div>
            <h3 className="text-lg font-semibold mb-4">Response</h3>
            <div className="items-center">
                <label className="text-sm font-semibold mr-2">Most Recent Reply:</label>
                <textarea
                className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
                placeholder="Greetings in Veritas and Fortitudo. Thank you for filing this ticket. Unfortunately, the ARC will be closed in the forthcoming week. Please return the book at the specified deadline to not incur any penalties. Therefore, this ticket has been rejected."
            ></textarea>
            </div>

            </div>
            
            

    )
};

export default TicketResponse;