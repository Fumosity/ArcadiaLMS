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
      // Fetch all ratings for the book
      const { data: ratings, error: ratingsError } = await supabase
        .from("ratings")
        .select("userID, ratingValue");

      if (ratingsError) throw ratingsError;
      console.log("Ratings:", ratings); // Log ratings

      // Fetch the colleges associated with the users who rated the book
      const { data: userColleges, error: userError } = await supabase
        .from("user_accounts")
        .select("userID, userCollege");

      if (userError) throw userError;
      console.log("User Colleges:", userColleges); // Log user accounts

      // Create a map of userID to their college for easy lookup
      const userCollegeMap = userColleges.reduce((acc, { userID, userCollege }) => {
        acc[userID] = userCollege;
        return acc;
      }, {});
      console.log("User College Map:", userCollegeMap); // Log user college map

      // Create a map of userID to rating for easy lookup
      const userRatingsMap = ratings.reduce((acc, { userID, ratingValue }) => {
        acc[userID] = ratingValue;
        return acc;
      }, {});
      console.log("User Ratings Map:", userRatingsMap); // Log user ratings map

      // Now, we need to merge both maps (userCollegeMap and userRatingsMap) without depending on transactions
      const mergedUserData = ratings.reduce((acc, { userID, ratingValue }) => {
        const userCollege = userCollegeMap[userID];

        console.log(`Processing userID: ${userID}, College: ${userCollege}, Rating: ${ratingValue}`);

        // Proceed if the user has both a college and a rating
        if (userCollege && ratingValue !== undefined) {
          if (!acc[userCollege]) {
            acc[userCollege] = { ratingCount: 0, totalRating: 0 };
          }
          acc[userCollege].ratingCount += 1;  // Increment rating count
          acc[userCollege].totalRating += ratingValue;  // Aggregate ratings
        }
        return acc;
      }, {});

      console.log("Merged User Data by College:", mergedUserData); // Log the merged data by college

      // Calculate average rating per college and sort by rating count and average rating
      const sortedColleges = Object.entries(mergedUserData)
        .map(([college, { ratingCount, totalRating }]) => {
          const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0;
          return { college, ratingCount, averageRating };
        })
        .sort((a, b) => {
          // Prioritize rating count first, then average rating if rating count is the same
          if (b.ratingCount === a.ratingCount) {
            return b.averageRating - a.averageRating; // Higher rating first
          }
          return b.ratingCount - a.ratingCount; // Higher rating count first
        })
        .slice(0, 5); // Top 5 colleges

      console.log("Sorted Colleges:", sortedColleges); // Log sorted colleges

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
              </tr>
            ))
          ) : colleges.length > 0 ? (
            colleges.map((college, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-center text-sm">{college.college}</td>
                <td className="px-4 py-2 text-center text-sm">{college.ratingCount}</td>
                <td className="px-4 py-2 text-center text-sm">{college.averageRating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
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
