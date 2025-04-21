import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UHero = () => {
    const slides = [
        {
            image: "/image/arc1.JPG",
            title: <>Explore ARC's<br />Services Now!</>,
            description: <>View Different Services ARC has to offer</>,
            buttonText: "View Services",
            link: "/user/services"
        },
        {
            image: "/image/arc3.JPG",
            title: <>Browse the LPU-C <br /> Academic Resource Center</>,
            description: <>Discover knowledge, explore resources, and reserve your favorite books today.</>,
            buttonText: "See the Book Catalog",
            link: "/user/bookmanagement"
        },
        {
            image: "/image/arc2.JPG",
            title: <>Explore our Research Collection</>,
            description: <>Find the resources you need for your academic success.</>,
            buttonText: "View Research Catalog",
            link: "/user/researchmanagement"
        },
        {
            image: "/image/arc6.JPG",
            title: <>Reservation of Rooms <br />Now Available!</>,
            description: "Reserve rooms for academic purposes.",
            buttonText: "View Available Rooms",
            link: "/user/reservations"
        },
        
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const currentSlide = slides[currentIndex];

    // Optional guard (useful if slides could ever be empty)
    if (!currentSlide) {
        return null; // Or some fallback UI
    }

    return (
        <div className="uHero-cont">
            <section className="userHero relative overflow-hidden rounded-lg w-full h-[500px]">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={`Hero Background ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
                            }`}
                    />
                ))}

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col items-start justify-center text-center w-full h-full px-4 py-16 bg-black/50">
                    <h1 className="justify-start text-left userHero-title pl-4 text-white text-4xl md:text-5xl font-bold mb-4">
                        {currentSlide.title}
                    </h1>
                    <p className="userHero-text text-white pl-4 text-lg md:text-xl mb-6">
                        {currentSlide.description}
                    </p>
                    <Link
                        to={currentSlide.link}
                        className="px-6 py-2 border border-white ml-4 rounded-full text-white hover:bg-arcadia-red hover:border-arcadia-red transition duration-300"
                    >
                        {currentSlide.buttonText}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default UHero;
