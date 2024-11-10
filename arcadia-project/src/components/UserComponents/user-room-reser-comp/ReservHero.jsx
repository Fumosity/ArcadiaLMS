import React from "react";

const ReservHero = () => {
    return (
        <div className="uHero-cont">
            <section className="userHero relative">
                <div className="absolute inset-0">
                    <img 
                        src="image/reservHero.png" 
                        alt="Hero Background" 
                        className="w-full h-full object-cover rounded-lg" // Add rounded-lg here
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="userHero-title text-white">Reserve discussion rooms <br />for group presentations, <br /> consultations, and meetings.</h1>
                    <button className="mt-8 px-3 py-1 border border-white rounded-full text-white">Reserve A Room</button>
                </div>
            </section>
        </div>
    );
}
export default ReservHero;
