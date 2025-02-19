export default function SearchByGenre({ onGenreClick }) {
    const books = [
      {
        category: "Fiction",
        genre: "Fantasy",
        img: "/image/Fantasy.png",
        
      },
      {
        category: "Fiction",
        genre: "Sci-fi",
        img: "/image/Sci-fi.png",

      },
      {
        category: "Fiction",
        genre: "Mystery",
        img: "/image/Myst.png",

      },
      {
        category: "Non-fiction",
        genre: "Reference",
        img: "/image/Reference.png",

      },
      {
        category: "Non-fiction",
        genre: "Educational",
        img: "/image/Educ.png",

      },
    ]
  
    return (
      <div className="uMain-cont w-full px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Search by Genre</h2>
          <button className="uSee-more">See more</button>
        </div>
  
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
          {books.map((book, index) => (
            <div key={index} className="genCard-cont" onClick={() => onGenreClick(book)}>
              <div className="relative flex-none w-[145px] h-[300px] rounded-xl overflow-hidden cursor-pointer group">
                <img
                  src={book.img || "/placeholder.svg"}
                  alt={`${book.category} ${book.genre} Cover`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="text-sm opacity-90">{book.category}</p>
                  <h3 className="text-xl font-semibold mt-1 text-left">{book.genre}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  