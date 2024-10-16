import React from "react";

const UHero = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow mt-4">
            <section className="userHero relative">
                <div className="absolute inset-0">
                    <img 
                        src="image/bg-hero.png" 
                        alt="Hero Background" 
                        className="w-full h-full object-cover rounded-lg" // Add rounded-lg here
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="userHero-title text-white">Browse the LPU-C <br />Academic Resource Center <br /> for all your academic needs!</h1>
                    <p className="userHero-text text-white">Discover knowledge, explore resources, and reserve your favorite books today.</p>
                    <button className="userHero-button bg-blue-500 rounded-full text-white">See the Book Catalog</button>
                </div>
            </section>
        </div>
    );
}
export default UHero;
