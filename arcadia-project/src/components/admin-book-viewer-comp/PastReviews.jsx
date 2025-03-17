import { useState, useEffect } from "react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { supabase } from "/src/supabaseClient.js"

const PastReviews = ({ titleID }) => {
  const [ratingData, setRatingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRatings, setTotalRatings] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchRatings = async () => {
      if (!titleID) {
        console.log("No titleID provided to PastReviews component")
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("ratings")
          .select("ratingValue")
          .eq("titleID", titleID)

        if (error) {
          console.error("Error fetching ratings:", error.message)
          setLoading(false)
          return
        }

        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

        data.forEach((rating) => {
          const value = rating.ratingValue
          if (value >= 1 && value <= 5) {
            ratingCounts[value]++
          }
        })

        const total = data.length
        let sum = 0
        data.forEach((rating) => {
          sum += rating.ratingValue
        })
        const average = total > 0 ? (sum / total).toFixed(1) : 0

        const formattedData = Object.keys(ratingCounts).map((rating) => ({
          name: Number.parseInt(rating),
          Rating: ratingCounts[rating],
          fill: getRatingColor(Number.parseInt(rating)),
        }))

        setRatingData(formattedData)
        setTotalRatings(total)
        setAverageRating(average)
      } catch (error) {
        console.error("Error in fetchRatings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [titleID])

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1:
        return "#902424"
      case 2:
        return "#902424"
      case 3:
        return "#902424"
      case 4:
        return "#902424"
      case 5:
        return "#902424"
      default:
        return "#902424"
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Rating Breakdown</h3>
        {!loading && totalRatings > 0 && (
          <div className="text-right">
            <p className="text-lg font-medium">{averageRating} / 5</p>
            <p className="text-sm text-gray-500">Based on {totalRatings} ratings</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading ratings data...</p>
        </div>
      ) : ratingData.some((item) => item.Rating > 0) ? (
        <div className="h-80 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              barCategoryGap={30} // adds space between bars
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                type="category" // switch from "number" to "category"
                label={{
                  value: "Rating Value",
                  position: "insideBottom",
                  offset: -5,
                }}
                padding={{ left: 20, right: 20 }} // Add padding to avoid clipping
              />

              <YAxis
                label={{
                  value: "Number of Ratings",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
                allowDecimals={false}
                tickCount={Math.max(...ratingData.map(d => d.Rating)) + 1} // Whole numbers only
              />

              <Tooltip
                formatter={(value) => [`${value} ratings`, "Rating"]}
                labelFormatter={(label) => `${label}-Star Rating`}
              />

              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginBottom: "20px" }}
              />

              <Bar
                dataKey="Rating"
                name="Number of Ratings"
                isAnimationActive={true}
                radius={[4, 4, 0, 0]} // Rounded top edges
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 border border-gray-200 rounded-lg">
          <p className="text-gray-500">No ratings available for this book.</p>
        </div>
      )}
    </div>
  )
}

export default PastReviews
