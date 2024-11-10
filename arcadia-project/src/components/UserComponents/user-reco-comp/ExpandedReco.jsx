import React, { useState } from "react";

const ExpandedReco = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5; // Total number of recommended books
    const entriesPerPage = 4; // Books per page
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Placeholder book data
    const books = [
        { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", rating: 4.35, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "System Design Interview", author: "Alex Xu", rating: 3.21, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Agile Practice Guide", author: "Project Management Institute", rating: 3.69, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Why Machines Learn", author: "Anil Ananthaswamy", rating: 4.65, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "CCNA 200-301", author: "Wendell Odom", rating: 4.93, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "The Metamorphosis", author: "Franz Kafka", rating: 4.12, img: "https://via.placeholder.com/150x220", category: "Fiction; Novella, Absurdist" },
        { title: "Happiness For Dummies", author: "W. Doyle Gentry", rating: 4.32, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Guiness World Records 2024", author: "Guinness World Records", rating: 4.56, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Reference, Yearbook" },
        { title: "Cobol: Cobol Basics for Beginners", author: "Andy Vickler", rating: 3.25, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Atomic Habits: An Easy & Proven Way...", author: "James Clear", rating: 4.51, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Self-help" },
        { title: "The War of the Worlds", author: "H.G. Wells", rating: 4.95, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Science Fiction" },
        { title: "No Longer Human", author: "Osamu Dazai", rating: 4.99, img: "https://via.placeholder.com/150x220", category: "Fiction; Short Story, Psychological" },
        { title: "1984", author: "George Orwell", rating: 4.86, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Political" },
        { title: "Lord of the Flies", author: "William Golding", rating: 4.78, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Survival" },
        { title: "And then there were none", author: "Agatha Christie", rating: 4.67, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Mystery" },
        { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", rating: 4.35, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "System Design Interview", author: "Alex Xu", rating: 3.21, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Agile Practice Guide", author: "Project Management Institute", rating: 3.69, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Why Machines Learn", author: "Anil Ananthaswamy", rating: 4.65, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "CCNA 200-301", author: "Wendell Odom", rating: 4.93, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "The Metamorphosis", author: "Franz Kafka", rating: 4.12, img: "https://via.placeholder.com/150x220", category: "Fiction; Novella, Absurdist" },
        { title: "Happiness For Dummies", author: "W. Doyle Gentry", rating: 4.32, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Guiness World Records 2024", author: "Guinness World Records", rating: 4.56, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Reference, Yearbook" },
        { title: "Cobol: Cobol Basics for Beginners", author: "Andy Vickler", rating: 3.25, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Educational" },
        { title: "Atomic Habits: An Easy & Proven Way...", author: "James Clear", rating: 4.51, img: "https://via.placeholder.com/150x220", category: "Nonfiction; Guide, Self-help" },
        { title: "The War of the Worlds", author: "H.G. Wells", rating: 4.95, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Science Fiction" },
        { title: "No Longer Human", author: "Osamu Dazai", rating: 4.99, img: "https://via.placeholder.com/150x220", category: "Fiction; Short Story, Psychological" },
        { title: "1984", author: "George Orwell", rating: 4.86, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Political" },
        { title: "Lord of the Flies", author: "William Golding", rating: 4.78, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Survival" },
        { title: "And then there were none", author: "Agatha Christie", rating: 4.67, img: "https://via.placeholder.com/150x220", category: "Fiction; Novel, Mystery" },
    ];
    

    return (
        <div className="uMain-cont">
            
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                {books.map((book, index) => (
                    <a
                    href="#"
                    key={index}
                    className="block bookCard-cont p-4 rounded-lg shadow-md transition transform hover:shadow-lg hover:scale-105"
                >
                    <img
                        src={book.img}
                        alt={book.title}
                        className="object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2 truncate">{book.title}</h3>
                    <p className="text-sm font-semibold text-gray-500 mb-0.5 truncate">{book.author}</p>
                    <p className="text-xs text-gray-400 mb-0.5 truncate">{book.category}</p>
                    <div className="flex items-center space-x-1">
                        <span className="text-bright-yellow text-sm mr-0.5">★</span>
                        <p className="text-xs font-semibold text-arcadia-black mb-0 truncate">{book.rating.toFixed(2)}</p>
                    </div>

                </a>
                ))}
            </div>

            
        </div>
    );
};

export default ExpandedReco;
