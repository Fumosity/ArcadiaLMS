import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ExcellentExport from "excellentexport";
import SelectFormat from "../../z_modals/confirmation-modals/SelectFormat";

const BCSideButtons = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch data from Supabase
  const fetchBookTransactions = async () => {
    const { data, error } = await supabase
      .from("book_transactions")
      .select(`
        transactionID,
        transactionType,
        checkoutDate,
        checkoutTime,
        checkinDate,
        checkinTime,
        bookBarcode,
        deadline,
        user_accounts (userFName, userLName)
      `);

    if (error) {
      console.error("Error fetching book circulation data:", error);
      return [];
    }

    return data;
  };

  // Function to export as XLSX
  const exportAsXLSX = async () => {
    const data = await fetchBookTransactions();
    if (data.length === 0) return;

    const table = document.createElement("table");
    const currentDate = new Date().toISOString().split("T")[0];

    // Create table headers
    const headerRow = table.insertRow();
    const headers = [
      "Transaction ID",
      "User Name",
      "Transaction Type",
      "Checkout Date",
      "Checkout Time",
      "Check-in Date",
      "Check-in Time",
      "Book Barcode",
      "Deadline",
    ];
    headers.forEach((header) => {
      const cell = headerRow.insertCell();
      cell.textContent = header;
    });

    // Populate table rows
    data.forEach((transaction) => {
      const row = table.insertRow();
      row.insertCell().textContent = transaction.transactionID;
      row.insertCell().textContent = transaction.user_accounts
        ? `${transaction.user_accounts.userFName} ${transaction.user_accounts.userLName}`
        : "Unknown User";
      row.insertCell().textContent = transaction.transactionType;
      row.insertCell().textContent = transaction.checkoutDate || "N/A";
      row.insertCell().textContent = transaction.checkoutTime || "N/A";
      row.insertCell().textContent = transaction.checkinDate || "N/A";
      row.insertCell().textContent = transaction.checkinTime || "N/A";
      row.insertCell().textContent = transaction.bookBarcode;
      row.insertCell().textContent = transaction.deadline || "N/A";
    });

    // Trigger download
    const link = document.createElement("a");
    document.body.appendChild(link);
    ExcellentExport.convert(
      {
        anchor: link,
        filename: `Book_Circulation_History_${currentDate}`,
        format: "xlsx",
      },
      [{ name: "Book Circulation", from: { table } }]
    );
    link.click();
    document.body.removeChild(link);
  };

  // Function to export as CSV
  const exportAsCSV = async () => {
    const data = await fetchBookTransactions();
    if (data.length === 0) return;

    const currentDate = new Date().toISOString().split("T")[0];

    // Define CSV headers
    let csvContent = `"Transaction ID","User Name","Transaction Type","Checkout Date","Checkout Time","Check-in Date","Check-in Time","Book Barcode","Deadline"\n`;

    data.forEach(transaction => {
      const row = [
        `"${transaction.transactionID}"`,
        `"${transaction.user_accounts ? `${transaction.user_accounts.userFName} ${transaction.user_accounts.userLName}` : "Unknown User"}"`,
        `"${transaction.transactionType}"`,
        `"${transaction.checkoutDate || "N/A"}"`,
        `"${transaction.checkoutTime || "N/A"}"`,
        `"${transaction.checkinDate || "N/A"}"`,
        `"${transaction.checkinTime || "N/A"}"`,
        `"${transaction.bookBarcode}"`,
        `"${transaction.deadline || "N/A"}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create CSV blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Book_Circulation_History_${currentDate}.csv`;
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

  const actions = [
    { action: "Access Book Checking", path: "/admin/bookcheckinout" },
    { action: "Access Book Circulation", path: "/admin/abcirculationpage" },
    { action: "Export Book Circulation History", onClick: () => setIsModalOpen(true) },
  ];

  return (
    <>
      <div className="flex-col justify-center w-full space-y-2">
        {actions.map((item, index) => (
          <div key={index} onClick={item.onClick ? item.onClick : () => navigate(item.path)}>
            <button
              className="h-10 flex items-center justify-center border border-lg w-full px-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {/* Export format selection modal */}
      <SelectFormat isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onExport={handleExport} />
    </>
  );
};

export default BCSideButtons;
