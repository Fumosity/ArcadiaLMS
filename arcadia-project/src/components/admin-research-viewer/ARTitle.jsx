import React from "react";

const ARTitle = ({ researchData }) => {
    const { title, author, abstract, keyword } = researchData; // Destructure the needed fields

    return (
        <>
            <div className="space-y-4">
                <h1 className="text-zinc-900 text-3xl font-ZenSerif font-medium leading-tight">
                    {title}
                </h1>
                <h2 className="text-zinc-900 text-xl font-medium leading-snug">
                    {author}
                </h2>
            </div>

            <div className="space-y-4 mt-6">
                <div className="w-full max-w-2xl">
                    <strong className="text-zinc-900 text-base font-bold">
                        Abstract:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal text-justify">
                        {abstract}
                    </p>
                </div>

                <div className="w-full max-w-lg">
                    <strong className="text-zinc-900 text-base font-bold">
                        Keywords:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal">
                        {keyword}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ARTitle;
