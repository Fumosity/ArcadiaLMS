import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ARAbout = ({ researchData }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    if (!researchData)
        return (
            <div className="bg-white p-4 rounded-lg border-grey border w-full">
                <Skeleton height={20} width={150} className="mb-2" />
                <Skeleton height={200} className="mb-2" />
                <Skeleton count={8} className="mb-1" />
                <Skeleton width={100} height={25} className="mt-2" />
                <Skeleton width={100} height={25} className="mt-2" />
            </div>
        );

    // Destructure fields from researchData
    const researchDetails = {
        researchID: researchData.researchID,
        title: researchData.title,
        author: Array.isArray(researchData.author) ? researchData.author.join(', ') : (researchData.author ?? '').split(';').join(',') || '',
        college: researchData.college,
        department: researchData.department,
        keywords: Array.isArray(researchData.keywords) ? researchData.keywords.join(', ') : (researchData.keywords ?? '').split(';').join(',') || '',
        pubDate: researchData.pubDate,
        location: researchData.location,
        researchCallNum: researchData.researchCallNum,
    }

    console.log(researchData)
    console.log(researchDetails)

    const handleModifyResearch = () => {
        console.log("Title in ResearchPreviewInventory:", researchDetails.title);
        const queryParams = new URLSearchParams(researchDetails).toString();
        navigate(`/admin/researchmodify?${queryParams}`);
    };

    return (
        <div>
            <div className="flex justify-center gap-2">
                <button
                    className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
                    onClick={handleModifyResearch}
                >
                    Modify Research Paper
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg border-grey border w-full">
                <h3 className="text-2xl font-semibold mb-2">About</h3>
                <table className="w-full border-collapse">
                    <tbody>
                        {Object.entries(researchDetails)
                            .filter(([key]) => !["researchID"].includes(key)) // Exclude multiple keys
                            .map(([key, value], index) => (
                                <tr key={index} className="border-b border-grey">
                                    <td className="px-1 py-1 font-semibold capitalize w-1/3">
                                        {key === "pubdate"
                                            ? "Pub. Year:"
                                            : key === "researchCallNum"
                                                ? "Call No.:"
                                                : key.replace(/([A-Z])/g, " $1") + ":"}
                                    </td>
                                    <td className="px-1 py-1 text-sm break-words w-2/3">
                                        {(key === "abstract") && value && (
                                            <button className="border border-grey px-2 py-0.5 rounded-xl hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
                                                View
                                            </button>
                                        )}
                                        <span>{key === "abstract" ? "" : value || "N/A"}</span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default ARAbout;
