import React from "react";

const UHero = () => {
    return (
        <div className="uHero-cont">
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
                    <button className="px-3 py-1 border border-white rounded-full text-white">See the Book Catalog</button>
                </div>
            </section>
        </div>
    );
}
export default UHero;
