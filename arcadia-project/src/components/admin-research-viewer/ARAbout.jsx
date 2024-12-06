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
        researchID,
        researchARCID,
        cover,
    } = researchData || {};
    console.log("research data prev", researchData)

    console.log("research cover", cover)
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Research Front Page */}
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
                <img
                    src={cover || "image/researchpaper.png"} // Display cover or fallback image
                    alt="Research paper cover"
                    className="h-200 w-150 mx-auto mb-2 rounded border border-grey"
                />
                <p className="text-xs text-gray-500 mb-2 text-center">Research Cover</p>
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
                        { label: "Thesis ID", value: researchID },
                        { label: "ARC ID", value: researchARCID },
                    ].map(({ label, value }, index) => (
                        <tr key={index} className="border-b border-grey">
                            <td className="px-1 py-1 font-semibold" style={{ width: "40%" }}>
                                {label}:
                            </td>
                            <td className="px-1 py-1 text-sm flex justify-between items-center">
                            {(label === "Abstract") && value && (
                                    <button className="border border-grey px-2 py-0.5 rounded-xl hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
                                        View
                                    </button>
                                )}
                                <span>{label === "Abstract" ? "" : value || "N/A"}</span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ARAbout;
