import React from "react";

const ARTitle = () => {
    return (
        <>
            <div className="space-y-4">
                <h1 className="text-zinc-900 text-4xl font-['Zen Antique'] leading-tight">
                    Arcadia: Enhancing the Library Management System of the LPU-C Academic Resource Center
                </h1>
                <h2 className="text-zinc-900 text-2xl font-medium font-['Zen Kaku Gothic Antique'] leading-snug">
                    Mirasol, Yusuf; Marpuri, Keith Andrei; Fadri, Von Zachary; Sambile, Linus Karl
                </h2>
            </div>

            <div className="space-y-4 mt-6">
                <div className="w-full max-w-2xl">
                    <strong className="text-zinc-900 text-base font-bold">
                        Abstract:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal text-justify">
                        In today’s digital age, libraries’ roles as knowledge repositories and information gateways have expanded significantly (A. Meena, 2024). With the exponential increase of academic literature and the growing demand for access to different resources, efficient and accessible library systems have become essential (Ashmore, et al., 2020). According to a study conducted by Angadi in 2021, Digitization improves access to library resources. By digitizing library collections, information will be accessible to all instead of a group of researchers. Digital projects allow users to search for collections rapidly and comprehensively from anywhere at any time.
                    </p>
                </div>

                <div className="w-full max-w-lg">
                    <strong className="text-zinc-900 text-base font-bold">
                        Keywords:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal">
                        artificial intelligence; library management system; algorithms; computer science; knn
                    </p>
                </div>
            </div>
        </>
    );
};

export default ARTitle;
