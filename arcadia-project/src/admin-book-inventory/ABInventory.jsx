import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";
import BookPreviewInv from "../components/admin-book-inventory-comp/BookPreviewInventory";
import Title from "../components/main-comp/Title";
import ExcellentExport from "excellentexport";
import { supabase } from "../supabaseClient";
import SelectFormat from "../z_modals/confirmation-modals/SelectFormat";


const ABInventory = () => {
  useEffect(() => {
    document.title = "Arcadia | Book Inventory";
}, []);
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedBook, setSelectedBook] = useState(null); // State to hold the selected book details

  const handleBookSelect = (book) => {
    setSelectedBook(book); // Update selected book
  };

  const [showModal, setShowModal] = useState(false);

  const handleExportClick = () => {
    setShowModal(true);
  };

  const handleExport = (format) => {
    if (format === "xlsx") {
      exportAsXLSX();
    } else {
      exportAsCSV();
    }
    setShowModal(false);
  };

  const exportAsXLSX = async () => {
    const table = document.createElement("table");
    const currentDate = new Date().toISOString().split('T')[0];

    const headerRow = table.insertRow();
    const headers = ["Title ID", "Title", "Author", "Publisher", "Synopsis", "Keywords", "Pub. Year", "Location", "Call No.", "ISBN", "Price", "Date Procured"];
    headers.forEach(header => {
      const cell = headerRow.insertCell();
      cell.textContent = header;
    });

    const { data, error } = await supabase
      .from('book_titles')
      .select("titleID, title, author, publisher, synopsis, keywords, pubDate, location, titleCallNum, isbn, price, procurementDate");

    if (error) {
      console.error("Error fetching book inventory:", error);
      return;
    }

    data.forEach(book_titles => {
      const row = table.insertRow();
      row.insertCell().textContent = book_titles.titleID;
      row.insertCell().textContent = book_titles.title; 
      row.insertCell().textContent = book_titles.author;
      row.insertCell().textContent = book_titles.publisher;
      row.insertCell().textContent = book_titles.synopsis;
      row.insertCell().textContent = book_titles.keywords;
      row.insertCell().textContent = book_titles.pubDate;
      row.insertCell().textContent = book_titles.location;
      row.insertCell().textContent = book_titles.titleCallNum;
      row.insertCell().textContent = book_titles.isbn;
      row.insertCell().textContent = book_titles.price;
      row.insertCell().textContent = book_titles.procurementDate;
      
      
    });

    const link = document.createElement("a");
    document.body.appendChild(link);
    ExcellentExport.convert(
      { anchor: link, filename: `Book_Inventory${currentDate}`, format: "xlsx" },
      [{ name: "Book Inventory", from: { table } }]
    );
    link.click();
    document.body.removeChild(link);
  };

  const exportAsCSV = async () => {
    const { data, error } = await supabase
      .from("book_titles")
      .select("titleCallNum, title, author, publisher, isbn, pubDate, procurementDate");

    if (error) {
      console.error("Error fetching book inventory:", error);
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];

    // Define CSV headers
    const headers = [
      "Title Call No.", "Title", "Author", "Publisher",
      "ISBN", "Pub Date", "Procurement Date"
    ];

    // Initialize CSV content with headers
    const csvRows = [headers.join(",")];

    data.forEach(book => {
      csvRows.push([
        `"${book.titleCallNum}"`,
        `"${book.title}"`,
        `"${book.author}"`,
        `"${book.publisher}"`,
        `"${book.isbn}"`,
        `"${book.pubDate}"`,
        `"${book.procurementDate}"`
      ].join(","));
    });

    // Create CSV blob and trigger download
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `BookInventory_${currentDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Title>Book Inventory</Title>

      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/bookadding')} // Navigate to ABAdd on click
            >
              Add a Book Title
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/genremanagement')} // Navigate to ABAdd on click
            >
              Genre Management
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/libsecmanagement')} // Navigate to ABAdd on click
            >
              Library Section Management
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={handleExportClick}
            >
              Export Book Inventory
            </button>
          </div>
          <div id="book-inventory">
            <CurrentBookInventory onBookSelect={handleBookSelect} />
          </div>'
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <div className="w-full">
            <BookPreviewInv book={selectedBook} /> {/* Pass the selected book to BookPreviewInv */}
          </div>
        </div>
      </div>
      <SelectFormat isOpen={showModal} onClose={() => setShowModal(false)} onExport={handleExport} />
    </div>
  );
};

export default ABInventory;
