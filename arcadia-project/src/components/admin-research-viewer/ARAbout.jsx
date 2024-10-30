import React from "react";

const ARAbout = ({ researchData }) => {
    // Destructure fields from researchData, including cover
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
        arcID,
        cover, 
    } = researchData || {};

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Research Front Page */}
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <div className="relative bg-white p-2 mb-4 rounded-lg border">
                <img
                    src={cover || "image/researchpaper.png"} // Display cover or fallback image
                    alt="Research paper cover"
                    className="h-200 w-150 mx-auto mb-2 rounded"
                />
                <p className="text-xs text-gray-500 mb-2 text-center">Click to update book cover</p>
            </div>

            {/* Research details with conditional buttons */}
            <table className="min-w-full border-collapse">
                <tbody>
                    {[
                        { label: "Title", value: title },
                        { label: "Author", value: author },
                        { label: "College", value: college },
                        { label: "Department", value: department },
                        { label: "Abstract", value: abstract },
                        { label: "Pages", value: pages },
                        { label: "Keywords", value: keyword },
                        { label: "Published Date", value: pubDate },
                        { label: "Location", value: location },
                        { label: "Thesis ID", value: thesisID },
                        { label: "ARC ID", value: arcID },
                    ].map(({ label, value }, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="px-1 py-1 font-semibold" style={{ width: "40%" }}>
                                {label}:
                            </td>
                            <td className="px-1 py-1 text-sm flex justify-between items-center">
                                <span>{value || "N/A"}</span>
                                {(label === "Abstract" || label === "Pages") && value && (
                                    <button className="ml-2 border border-blue-500 px-2 py-0.5 rounded-xl">
                                        View
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ARAbout;
