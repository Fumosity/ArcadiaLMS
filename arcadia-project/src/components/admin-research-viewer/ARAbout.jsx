import React from "react";

const ARAbout = ({ researchData }) => {
    // Destructure the needed fields from researchData
    const {
        title,
        author,
        college,
        department,
        abstract,
        pages,
        keyword,
        pubDate, 
        location,
        thesisID,
        arcID 
    } = researchData;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Research Front Page */}
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <div className="relative bg-white p-2 mb-4 rounded-lg border">
                <img src="image/researchpaper.png" alt="Research paper cover" className="h-200 w-150 mx-auto mb-2 rounded" />
                <p className="text-xs text-gray-500 mb-2 text-center">Click to update book cover</p>
            </div>

            <table className="min-w-full border-collapse">
                <tbody>
                    {Object.entries({
                        title,
                        author,
                        college,
                        department,
                        abstract,
                        pages,
                        keyword,
                        pubDate,
                        location,
                        thesisID,
                        arcID
                    }).map(([key, value], index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                                {key.replace(/([A-Z])/g, ' $1')}:
                            </td>
                            <td className="px-1 py-1 text-sm flex justify-between items-center">
                                <span>{value}</span>
                                {key === 'abstract' || key === 'pages' ? (
                                    <button className="ml-2 border border-blue-500 px-2 py-0.5 rounded-xl">
                                        View
                                    </button>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ARAbout;
