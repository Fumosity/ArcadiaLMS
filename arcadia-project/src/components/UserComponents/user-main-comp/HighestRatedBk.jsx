import React from "react";

const HighestRatedBk = () =>{
    return(
        <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Highest Rated Books</h2>
    <ul className="space-y-2 text-sm text-gray-600 divide-y divide-grey">
      <li className="flex justify-between py-2">
        <span>No Longer Human</span>
        <span>4.57</span>
      </li>
      <li className="flex justify-between py-2">
        <span>The War of the Worlds</span>
        <span>4.56</span>
      </li>
      <li className="flex justify-between py-2">
        <span>The Wind and the Leaves</span>
        <span>4.55</span>
      </li>
      <li className="flex justify-between py-2">
        <span>The Great Gatsby</span>
        <span>4.54</span>
      </li>
      <li className="flex justify-between py-2">
        <span>Brave New World</span>
        <span>4.53</span>
      </li>
    </ul>
  </div>
    )
}
export default HighestRatedBk;