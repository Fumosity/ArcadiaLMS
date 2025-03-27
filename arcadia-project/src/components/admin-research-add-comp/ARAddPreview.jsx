import React from "react";

const ARAddPreview = ({ formData }) => {
  const {
    title = "N/A",
    author = "N/A",
    college = "N/A",
    department = "N/A",
    abstract = "N/A",
    pages = "N/A",
    keyword = "N/A",
    pubDate = "N/A",
    location = "N/A",
    researchID = "N/A",
    researchCallNum = "N/A",
  } = formData;

  const thesisDetails = {
    title,
    author,
    college,
    department,
    abstract,
    pages,
    keywords: keyword,
    datePublished: pubDate,
    location,
    databaseID: researchID,
    researchCallNum,
  };

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg border-grey border w-full mt-12">
        <h3 className="text-2xl font-semibold mb-2">Research Preview</h3>
        <table className="min-w-full border-collapse">
          <tbody>
            {Object.entries(thesisDetails)
            .filter(([key]) => !["databaseID"].includes(key))
            .map(([key, value], index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize w-1/3" >
                  {key == "researchCallNum" ? "Call No."
                  :
                  key == "datePublished" ? "Pub. Date"
                  :
                  key.replace(/([A-Z])/g, ' $1')}:
                </td>
                <td className="px-1 py-1 text-sm break-words w-2/3">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ARAddPreview;
