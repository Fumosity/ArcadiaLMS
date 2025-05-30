// src/z_modals/PrintReportModal.jsx
import React from "react";
import DecommissionedBks from "../components/admin-book-circ-pg-comp/DecommissionedBks";
import DamagedBks from "../components/admin-book-circ-pg-comp/DamagedBks";

const REPORT_COLUMNS = {
  BookCirculation: {
    reportTitle: "Book Circulation Report",
    transNo: "Transaction No.",
    type: "Type",
    date: "Date",
    time: "Time",
    borrower: "Borrower",
    schoolNo: "School No.",
    college: "College",
    department: "Department",
    bookTitle: "Book Title",
    bookBarcode: "Barcode",
    deadline: "Deadline"
  },
  Outstanding: {
    reportTitle: "Outstanding Users Report",
    user_name: "Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    book_title: "Title",
    book_barcode: "Barcode",
    overdue_days: "Days Overdue",
    fine_amount: "Total Fine"
  }
  ,
  Damaged: {
    reportTitle: "Damaged Books Report",
    user_name: "Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    book_title: "Title",
    book_barcode: "Barcode",
    fine: "Total Fine"
  },
  OverdueBooks: {
    reportTitle: "Overdue Books Report",
    type: "Type",
    date: "Date",
    time: "Time",
    borrower: "Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    bookTitle: "Book Title",
    bookBarcode: "Barcode",
    deadline: "Deadline",
  },
  DecommissionedBooks: {
    reportTitle: "Decommissioned Books Report",
    type: "Type",
    borrower: "Latest Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    bookTitle: "Book Title",
    bookBarcode: "Barcode",
    notes: "Notes",
  },
  DamagedBooks: {
    reportTitle: "Damaged Books Report",
    type: "Type",
    borrower: "Latest Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    bookTitle: "Book Title",
    bookBarcode: "Barcode",
    notes: "Notes",
  },
  BookInventory: {
    reportTitle: "Book Inventory Report",
    title: "Title",
    author: "Author",
    publisher: "Publisher",
    pubDate: "Date Published",
    titleCallNum: "Call No.",
    location: "Location",
    procurementDate: "Date Procured",
  },
  ResearchInventory: {
    reportTitle: "Research Inventory Report",
    title: "Title",
    author: "Author",
    college: "College",
    department: "Department",
    pubDate: "Date Published",
    researchCallNum: "Call No.",
    location: "Location",
  },
  UserAccounts: {
    reportTitle: "User Accounts Report",
    type: "Type",
    college: "College",
    department: "Department",
    name: "Name",
    schoolId: "School No.",
    email: "Email",
  },
  AdminAccounts: {
    reportTitle: "Admin Accounts Report",
    type: "Type",
    name: "Name",
    schoolId: "School No.",
    email: "Email",
  },
  BookCopies: {
    reportTitle: "Book Copies Report",
    type: "Type",
    borrower: "Latest Borrower",
    school_id: "School No.",
    user_college: "College",
    user_department: "Department",
    bookTitle: "Book Title",
    bookBarcode: "Barcode",
    notes: "Notes",
  },
  LibrarySections: {
    reportTitle: "Library Sections Report",
    standard: "Standard",
    class: "Class",
    classDesc: "Class Description",
    subclass: "Subclass",
    subclassDesc: "Subclass Description",
  },
  // Add more report types as needed
};

const PrintReportModal = ({ isOpen, onClose, filteredData, filters, username, reportType }) => {
  if (!isOpen) return null;

  const columnConfig = REPORT_COLUMNS[reportType] || {};
  const visibleKeys = Object.keys(columnConfig);

  const now = new Date().toLocaleString();

  console.log(filteredData)

  const formattedFilters = Object.entries(filters)
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const val = Array.isArray(value) ? value.filter(Boolean).join(", ") : value || "N/A";
      return `${label}: ${val}`;
    })
    .join(", ");


  const handlePrint = () => {
    const printContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${reportType} Report</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        font-size: 12px;
      }
      h2, h4 {
        text-align: center;
        margin: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 11px;
      }
      th, td {
        border: 1px solid #000;
        padding: 4px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <h2>Lyceum of the Philippines University - Cavite</h2>
    <h4>${columnConfig.reportTitle || "Report"}</h4>
    <p><strong>Printed by:</strong> ${username}</p>
    <p><strong>Printed on:</strong> ${now}</p>
<p><strong>Filters:</strong> ${formattedFilters}</p>
    <table>
      <thead>
        <tr>
          ${visibleKeys.filter(key => key !== 'reportTitle').map(key => `<th>${columnConfig[key]}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${filteredData.map(item => `
          <tr>
            ${visibleKeys.filter(key => key !== 'reportTitle').map(key => `<td>${item[key] ?? ''}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  </body>
  </html>
`;


    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Print Report</h2>
          <button className="text-red-500 font-semibold" onClick={onClose}>Close</button>
        </div>

        <div className="mb-4">
          <p><strong>Filters Applied:</strong></p>
          <ul className="text-sm list-disc list-inside">
            {Object.entries(filters).map(([key, value]) => (
              <li key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {Array.isArray(value) ? value.filter(Boolean).join(", ") : value || "None"}
              </li>
            ))}
          </ul>
        </div>

        <div className="my-3 text-left">
          <button
            onClick={handlePrint}
            className="sort-by bg-arcadia-red hover:bg-white text-white hover:text-arcadia-red font-semibold py-1 px-3 rounded-lg text-sm w-28"
          >
            Print Report
          </button>
        </div>

        <div className="overflow-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                {visibleKeys.filter(key => key !== 'reportTitle').map((key) => (
                  <th key={key} className="p-2 border">{columnConfig[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  {visibleKeys.filter(key => key !== 'reportTitle').map((key) => (
                    <td key={key} className="p-2 border">{item[key] ?? ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>   
      </div>
    </div>
  );
};

export default PrintReportModal;
