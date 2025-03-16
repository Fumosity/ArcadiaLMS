import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import CurrentResearchInventory from "../components/admin-research-inventory/CurrentResearchInventory";
import ResearchPreviewInv from "../components/admin-research-inventory/ResearchPreviewInv";
import {supabase} from "../supabaseClient";
import ExcellentExport from "excellentexport";

const ARInventory = () => {
  const [selectedResearch, setSelectedResearch] = useState(null);
  const navigate = useNavigate();
  const handleResearchSelect = (researchItem) => {
    setSelectedResearch(researchItem);
  };

  const exportAsXLSX = async () => {
    const table = document.createElement("table");
    const currentDate = new Date().toISOString().split('T')[0];

    const headerRow = table.insertRow();
    const headers = ["Research Call No.", "Title", "Author", "College", "Department", "PubDate"];
    headers.forEach(header => {
        const cell = headerRow.insertCell();
        cell.textContent = header;
    });

    const { data, error } = await supabase
        .from('research')
        .select("researchCallNum, title, author, college, department, pubDate");

    if (error) {
        console.error("Error fetching book inventory:", error);
        return;
    }

    data.forEach(research => {
        const row = table.insertRow();
        row.insertCell().textContent = research.researchCallNum;
        row.insertCell().textContent = research.title;research
        row.insertCell().textContent = research.author;
        row.insertCell().textContent = research.college;
        row.insertCell().textContent = research.department;
        row.insertCell().textContent = research.pubDate;
    });

    const link = document.createElement("a");
    document.body.appendChild(link);
    ExcellentExport.convert(
      { anchor: link, filename: `Research_Inventory${currentDate}`, format: "xlsx" },
        [{ name: "Research Inventory", from: { table } }]
    );
    link.click();
    document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-white">
      <Title>Research Inventory</Title>
      {/* <MainHeader /> */}

      <div className="flex justify-center items-start space-x-2 pb-12 py-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchadding')}
            >
              Add Research
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={exportAsXLSX}
            >
              Export Research Inventory
            </button>
          </div>
          <CurrentResearchInventory onResearchSelect={handleResearchSelect} />
        </div>
        <div className="hidden lg:flex flex-col items-start flex-shrink-0 w-1/4">
          <div className="w-full">
            <ResearchPreviewInv research={selectedResearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARInventory;
