import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import CurrentResearchInventory from "../components/admin-research-inventory/CurrentResearchInventory";
import ResearchPreviewInv from "../components/admin-research-inventory/ResearchPreviewInv";
import { supabase } from "../supabaseClient";
import ExcellentExport from "excellentexport";
import SelectFormat from "../z_modals/confirmation-modals/SelectFormat";

const ARInventory = () => {
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleResearchSelect = (researchItem) => {
    setSelectedResearch(researchItem);
  };

  // Fetch Research Inventory Data
  const fetchResearchInventory = async () => {
    const { data, error } = await supabase
      .from("research")
      .select("researchCallNum, title, author, college, department, pubDate");

    if (error) {
      console.error("Error fetching research inventory:", error);
      return [];
    }

    return data;
  };

  // Export as XLSX
  const exportAsXLSX = async () => {
    const data = await fetchResearchInventory();
    if (data.length === 0) return;

    const table = document.createElement("table");
    const currentDate = new Date().toISOString().split("T")[0];

    // Create headers
    const headerRow = table.insertRow();
    const headers = ["Research Call No.", "Title", "Author", "College", "Department", "PubDate"];
    headers.forEach(header => {
      const cell = headerRow.insertCell();
      cell.textContent = header;
    });

    // Populate table rows
    data.forEach(research => {
      const row = table.insertRow();
      row.insertCell().textContent = research.researchCallNum;
      row.insertCell().textContent = research.title;
      row.insertCell().textContent = research.author;
      row.insertCell().textContent = research.college;
      row.insertCell().textContent = research.department;
      row.insertCell().textContent = research.pubDate;
    });

    // Trigger XLSX download
    const link = document.createElement("a");
    document.body.appendChild(link);
    ExcellentExport.convert(
      {
        anchor: link,
        filename: `Research_Inventory_${currentDate}`,
        format: "xlsx",
      },
      [{ name: "Research Inventory", from: { table } }]
    );
    link.click();
    document.body.removeChild(link);
  };

  // Export as CSV
  const exportAsCSV = async () => {
    const data = await fetchResearchInventory();
    if (data.length === 0) return;
  
    const currentDate = new Date().toISOString().split("T")[0];
  
    let csvContent = "Research Call No.,Title,Author,College,Department,PubDate\n";
  
    data.forEach(research => {
      const row = [
        `"${research.researchCallNum}"`,
        `"${research.title}"`,
        `"${research.author}"`,
        `"${research.college}"`,
        `"${research.department}"`,
        `"${research.pubDate}"`
      ];
      csvContent += row.join(",") + "\n";
    });
  
    // Create CSV blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Research_Inventory_${currentDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle format selection
  const handleExport = (format) => {
    setIsModalOpen(false);
    if (format === "xlsx") exportAsXLSX();
    if (format === "csv") exportAsCSV();
  };

  return (
    <div className="min-h-screen bg-white">
      <Title>Research Inventory</Title>

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
              onClick={() => setIsModalOpen(true)}
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

      {/* Export format selection modal */}
      <SelectFormat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onExport={handleExport} />
    </div>
  );
};

export default ARInventory;
