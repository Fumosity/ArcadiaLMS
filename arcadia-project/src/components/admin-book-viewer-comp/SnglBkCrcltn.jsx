import React, { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';

const SnglBkCrcltn = ({ titleID }) => {
  console.log("SnglBkCrcltn received titleID:", titleID); // Debug log to confirm
  const [sortOrder, setSortOrder] = useState("Descending");
  const [entries, setEntries] = useState(10);
  const [typeOrder, setTypeOrder] = useState("Borrowed");
  const [dateRange, setDateRange] = useState("After 2020");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bkhistoryData, setBkhistoryData] = useState([]);
  const totalEntries = bkhistoryData.length;
  const totalPages = Math.ceil(totalEntries / entries);
  const navigate = useNavigate();

  useEffect(() => {
    if (titleID == null || isNaN(titleID)) {
      console.error("titleID is not a valid number or is null");
      return;
    }

    const fetchData = async () => {
      console.log("current titleID:", titleID);

      try {
        // Step 1: Fetch books associated with the current titleID from book_indiv
        const { data: bookIndiv, error: bookIndivError } = await supabase
          .from('book_indiv')
          .select('bookID, titleID')
          .eq('titleID', titleID); // Fetch only books for the current titleID

        console.log("current titleID:", titleID);

        if (bookIndivError) {
          console.error("Error fetching book_indiv: ", bookIndivError.message);
          return;
        }

        // Get a list of bookIDs for the current titleID
        const bookIDs = bookIndiv.map(book => book.bookID);

        const { data: transactions, error: transactionError } = await supabase
          .from('book_transactions')
          .select(`
          transaction_type, 
          checkin_date, 
          checkin_time, 
          checkout_date, 
          checkout_time, 
          userID, 
          bookID,
          user_accounts (
              userFName,
              userLName,
              userLPUID
          )`)
          .in('bookID', bookIDs); // Use the .in() filter to include only the relevant bookIDs

        if (transactionError) {
          console.error("Error fetching transactions: ", transactionError.message);
        } else {
          // Step 3: Fetch book_titles to get the details of the title
          const { data: bookTitles, error: bookTitlesError } = await supabase
            .from('book_titles')
            .select('titleID, title, price')
            .eq('titleID', titleID); // Fetch only the title details for the given titleID

          if (bookTitlesError) {
            console.error("Error fetching book_titles: ", bookTitlesError.message);
          } else {
            // Step 4: Now join the data manually in JavaScript
            const formattedData = transactions.map(transaction => {
              const bookDetails = bookIndiv.find(book => book.bookID === transaction.bookID);
              const titleDetails = bookTitles[0]; // Since we know it's only one title for the current titleID

              const date = transaction.checkin_date || transaction.checkout_date;
              const time = transaction.checkin_time || transaction.checkout_time;

              let formattedTime = null;
              if (time) {
                const timeString = time.includes(':') ? time : `${time.slice(0, 2)}:${time.slice(2)}`;
                formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString('en-PH', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                });
              }

              return {
                type: transaction.transaction_type,
                date,
                time: formattedTime,
                borrower: `${transaction.user_accounts.userFName} ${transaction.user_accounts.userLName}`,
                bookTitle: titleDetails?.title || 'N/A',
                bookId: transaction.bookID,
                userId: transaction.userID,
                titleID: titleDetails?.titleID,
              };
            });

            setBkhistoryData(formattedData);
          }
        }


      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, [titleID]);

  // Filter and Sort logic
  const filteredData = bkhistoryData.filter(book =>
    book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.borrower.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting by both date and time (latest first for descending order)
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.date + "T" + a.time);
    const dateB = new Date(b.date + "T" + b.time);

    // Sort in descending order for latest first
    return sortOrder === "Descending" ? dateB - dateA : dateA - dateB;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * entries, currentPage * entries);

  const handleUserClick = (book) => {
    console.log("userid", book.userId, "user", book.borrower, book)
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: book.userId, user: book },
    });
  };



  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      {/* Title */}
      <h3 className="text-2xl font-semibold mb-2">Book Circulation History</h3>

      {/* Controls */}
      <div className="flex flex-wrap items-center mb-6 space-x-4">
        {/* Type */}
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Type:</span>
          <span className="bg-gray-200 border border-gray-300 py-1 px-3 rounded-full text-xs" style={{ borderRadius: "40px" }}>
            {typeOrder}
          </span>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Sort By:</span>
          <button
            onClick={() => setSortOrder(sortOrder === "Descending" ? "Ascending" : "Descending")}
            className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
            style={{ borderRadius: "40px" }}
          >
            {sortOrder}
          </button>
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Date Range:</span>
          <button
            onClick={() => setDateRange(dateRange === "After 2020" ? "After 2021" : "After 2020")}
            className="sort-by bg-gray-200 py-1 px-3 rounded-full text-xs"
            style={{ borderRadius: "40px" }}
          >
            {dateRange}
          </button>
        </div>

        {/* No. of Entries */}
        <div className="flex items-center space-x-2">
          <label htmlFor="entries" className="text-sm">No. of Entries:</label>
          <input
            type="number"
            id="entries"
            min="1"
            value={entries}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm"
            style={{ borderRadius: "40px", width: "80px" }}
            onChange={(e) => setEntries(e.target.value)}
          />
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="text-sm">Search:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm"
            style={{ borderRadius: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Title or borrower"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Barcode</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {paginatedData.length > 0 ? (
              paginatedData.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                                          ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}>
                    {book.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.time}</td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                    <button
                      onClick={() => handleUserClick(book)}
                      className="text-blue-500 hover:underline"
                    >
                      {book.borrower}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-arcadia-red font-semibold">
                    <Link
                      to={`/admin/abviewer?titleID=${encodeURIComponent(book.titleID)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {truncateTitle(book.bookTitle)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookBarcode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="px-4 py-2 text-center">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-2 space-x-4">
        <button className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span className="text-xs text-arcadia-red">Page {currentPage}</span>
        <button className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default SnglBkCrcltn;