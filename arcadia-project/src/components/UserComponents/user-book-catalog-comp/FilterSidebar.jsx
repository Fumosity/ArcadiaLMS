import React from "react"
import CatGenre from "./CatGenre"
import PublicationYear from "./PublicationYear"
import Language from "./Language"

export default function FilterSidebar() {
    return (


        <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mt-4">

            <div className="uSidebar-filter flex items-center space-x-2 px-3 py-0.5 border border-grey rounded-xl">
                <label htmlFor="sort" className="text-sm font-semibold">Sort:</label>

                {/* Select Dropdown with Custom Arrow */}
                <div className="relative">
                    <select
                        id="sort"
                        className="text-sm rounded-xl bg-white focus:outline-none focus:ring-0 appearance-none pr-4 px-3"
                        defaultValue="best-match"
                    >
                        <option value="best-match">Best Match</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="date-desc">Newest to Oldest</option>
                        <option value="date-asc">Oldest to Newest</option>
                    </select>

                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <svg
                            className="w-4 h-4 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>




            <button className="uSidebar-filter text-arcadia-red px-3 py-0.5 text-sm font-semibold text-left border border-grey rounded-xl hover:underline">
                Clear Filters
            </button>


            <PublicationYear />




            <CatGenre />




            <Language />

        </div>







    )
}