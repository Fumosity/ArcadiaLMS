import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PopularAmong = ({ titleID }) => {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopColleges = async () => {
    console.log("Fetching top colleges for titleID:", titleID);
    try {
      // Fetch ratings for this specific titleID
      const { data: ratings, error: ratingsError } = await supabase
        .from("ratings")
        .select("userID, ratingValue")
        .eq("titleID", titleID);
  
      if (ratingsError) throw ratingsError;
      console.log("Ratings for titleID:", ratings);
  
      // Fetch all borrow transactions for this titleID
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions") // Adjust to your borrow transactions table
        .select("userID, bookBarcode");
  
      if (transactionError) throw transactionError;
      console.log("Borrow Transactions:", transactions);
  
      // Fetch book metadata to get titleID for each bookBarcode
      const { data: bookMetadata, error: bookError } = await supabase
        .from("book_indiv") // Adjust to your book metadata table
        .select("bookBarcode, titleID")
        .eq("titleID", titleID); // Only for the specific book
  
      if (bookError) throw bookError;
      console.log("Book Metadata:", bookMetadata);
  
      // Create a mapping of bookBarcode -> titleID
      const bookBarcodeToTitle = bookMetadata.reduce((acc, { bookBarcode, titleID }) => {
        acc[bookBarcode] = titleID;
        return acc;
      }, {});
  
      // Filter transactions to only include those linked to this titleID
      const filteredTransactions = transactions.filter(({ bookBarcode }) => 
        bookBarcodeToTitle[bookBarcode] === titleID
      );
  
      console.log("Filtered Transactions for TitleID:", filteredTransactions);
  
      // Collect all userIDs involved in borrows or ratings
      const userIDs = [
        ...new Set([...ratings.map(r => r.userID), ...filteredTransactions.map(t => t.userID)])
      ];
  
      // Fetch user colleges for involved users
      const { data: userColleges, error: userError } = await supabase
        .from("user_accounts")
        .select("userID, userCollege")
        .in("userID", userIDs);
  
      if (userError) throw userError;
      console.log("User Colleges:", userColleges);
  
      // Map userID -> College
      const userCollegeMap = userColleges.reduce((acc, { userID, userCollege }) => {
        acc[userID] = userCollege;
        return acc;
      }, {});
  
      // Aggregate borrow and rating data per college
      const collegeData = {};
  
      // Process ratings
      ratings.forEach(({ userID, ratingValue }) => {
        const college = userCollegeMap[userID];
        if (!college) return;
        if (!collegeData[college]) {
          collegeData[college] = { borrowCount: 0, ratingCount: 0, totalRating: 0 };
        }
        collegeData[college].ratingCount += 1;
        collegeData[college].totalRating += ratingValue;
      });
  
      // Process borrows
      filteredTransactions.forEach(({ userID }) => {
        const college = userCollegeMap[userID];
        if (!college) return;
        if (!collegeData[college]) {
          collegeData[college] = { borrowCount: 0, ratingCount: 0, totalRating: 0 };
        }
        collegeData[college].borrowCount += 1;
      });
  
      // Convert to array and sort
      const sortedColleges = Object.entries(collegeData)
        .map(([college, { borrowCount, ratingCount, totalRating }]) => ({
          college,
          borrowCount,
          ratingCount,
          totalRating,
          averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0,
        }))
        .sort((a, b) => (b.borrowCount === a.borrowCount ? b.averageRating - a.averageRating : b.borrowCount - a.borrowCount))
        .slice(0, 5);
  
      setColleges(sortedColleges);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching top colleges:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopColleges();
  }, [titleID]); // Rerun when the bookTitleID changes

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full">
      <h3 className="text-2xl font-semibold mb-2">Popular Among Colleges</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              College
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Borrows
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Ratings
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Rating
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-center text-sm">
                  <Skeleton />
                </td>
                <td className="px-4 py-2 text-center text-sm">
                  <Skeleton />
                </td>
                <td className="px-4 py-2 text-center text-sm">
                  <Skeleton />
                </td>
                <td className="px-4 py-2 text-center text-sm">
                  <Skeleton />
                </td>
              </tr>
            ))
          ) : colleges.length > 0 ? (
            colleges.map((college, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-center text-sm">{college.college}</td>
                <td className="px-4 py-2 text-center text-sm">{college.borrowCount}</td>
                <td className="px-4 py-2 text-center text-sm">{college.ratingCount}</td>
                <td className="px-4 py-2 text-center text-sm">{college.averageRating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                No colleges found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PopularAmong;
