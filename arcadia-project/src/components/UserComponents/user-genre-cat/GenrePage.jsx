const GenrePage = ({ selectedGenre, onBackClick }) => {

  // These are just placeholders for the actual books.
  const books = [
    { category: "Fiction", genre: "Fantasy", img: "/image/Fantasy.png" },
    { category: "Fiction", genre: "Sci-fi", img: "/image/Sci-fi.png" },
    { category: "Fiction", genre: "Mystery", img: "/image/Myst.png" },
    { category: "Non-fiction", genre: "Reference", img: "/image/Reference.png" },
    { category: "Non-fiction", genre: "Educational", img: "/image/Educ.png" },
    { category: "Fiction", genre: "Fantasy", img: "/image/Fantasy.png" },
    { category: "Fiction", genre: "Sci-fi", img: "/image/Sci-fi.png" },
    { category: "Fiction", genre: "Mystery", img: "/image/Myst.png" },
    { category: "Non-fiction", genre: "Reference", img: "/image/Reference.png" },
    { category: "Non-fiction", genre: "Educational", img: "/image/Educ.png" },
    { category: "Fiction", genre: "Fantasy", img: "/image/Fantasy.png" },
    { category: "Fiction", genre: "Sci-fi", img: "/image/Sci-fi.png" },
    { category: "Fiction", genre: "Mystery", img: "/image/Myst.png" },
    { category: "Non-fiction", genre: "Reference", img: "/image/Reference.png" },
    { category: "Non-fiction", genre: "Educational", img: "/image/Educ.png" },
  ]

  return (
    <div className="min-h-screen bg-light-white">
      <div className="uHero-cont mb-6">
        <div
          className="relative w-[950px] h-[280px] rounded-xl md:h-64 lg:h-72 xl:h-80 flex items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `url('${selectedGenre.img}')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">{selectedGenre.genre}</h1>
            <p className="text-sm md:text-lg">{selectedGenre.description}</p>
          </div>
        </div>
      </div>

      <div className="uMain-cont w-full px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{selectedGenre.genre} Books</h2>
          <button
            onClick={onBackClick}
            className="uSee-more"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book, index) => (
            <div key={index} className="genCard-cont">
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden cursor-pointer group">
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
    </div>
  )
}

export default GenrePage

