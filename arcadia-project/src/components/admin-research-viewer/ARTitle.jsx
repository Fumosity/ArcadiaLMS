import React from "react";

const ARTitle = ({ researchData }) => {
    const { title, author, abstract, keywords } = researchData; // Destructure the needed fields

    const formatAuthor = (authors) => {
        if (!authors || authors.length === 0) return "N/A";

        if (!Array.isArray(authors)) {
            authors = [authors]; // Ensure authors is an array
        }

        const formattedAuthors = authors.map(author => {
            author = author.trim();
            const names = author.split(" ");
            const firstName = names.slice(0, -1).join(" "); // First name(s)
            const lastName = names.slice(-1)[0]; // Last name
            return `${firstName} ${lastName}`;
        });

        if (formattedAuthors.length === 1) {
            return formattedAuthors[0];
        } else if (formattedAuthors.length === 2) {
            return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
        } else {
            return `${formattedAuthors.slice(0, -1).join(", ")}, and ${formattedAuthors.slice(-1)}`;
        }
    };

    const formatKeywords = (authors) => {
        if (!authors || authors.length === 0) return "N/A";

        if (!Array.isArray(authors)) {
            authors = [authors]; // Ensure authors is an array
        }

        const formattedKeywords = authors.map(author => {
            author = author.trim();
            const names = author.split(" ");
            const firstName = names.slice(0, -1).join(" "); // First name(s)
            const lastName = names.slice(-1)[0]; // Last name
            return `${firstName} ${lastName}`;
        });

        if (formattedKeywords.length === 1) {
            return formattedKeywords[0];
        } else if (formattedKeywords.length === 2) {
            return `${formattedKeywords[0]} and ${formattedKeywords[1]}`;
        } else {
            return `${formattedKeywords.slice(0, -1).join(", ")}, and ${formattedKeywords.slice(-1)}`;
        }
    };

    if (!researchData) {
        return (
            <div className="bg-white p-4 rounded-lg border-grey border">
                <Skeleton height={30} width={250} className="mb-2" />
                <Skeleton height={20} width={150} className="mb-4" />
                <Skeleton height={20} width={'100%'} className="mb-2" />
                <Skeleton height={20} width={'100%'} className="mb-2" />
                <Skeleton height={20} width={'80%'} />
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <h3 className="text-3xl font-medium mb-2 font-ZenSerif">{title}</h3>
            <p className="text-gray-600 text-xl mb-4">By {formatAuthor(author)}</p>
            <div className="w-full">
                <h4 className="font-semibold mb-2 text-lg">Abstract:</h4>
                <p className="text-md text-justify pb-2">
                    {abstract}
                </p>
            </div>
            <div className="w-full">
                <h4 className="font-semibold mb-2 text-lg">Keywords:</h4>
                <p className="text-md text-justify pb-2">
                    {formatKeywords(keywords)}
                </p>
            </div>
        </div>
    );

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
                <div className="w-full">
                    <strong className="text-zinc-900 text-base font-bold">
                        Abstract:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal text-justify">
                        {abstract}
                    </p>
                </div>

                <div className="w-full">
                    <strong className="text-zinc-900 text-base font-bold">
                        Keywords:
                    </strong>
                    <p className="text-zinc-900 text-base font-normal">
                        {keywords}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ARTitle;
