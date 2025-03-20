import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";  // To read URL params
import { Star } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs-dist/pdf.worker.min.mjs";

export default function RsrchInformation({ research }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(10);
    const [isLoading, setIsLoading] = useState(true);



    const onLoadSuccess = ({ numPages }) => {
        setNumPages(Math.min(numPages, 10));
        setIsLoading(false);
    };

    const onLoadError = (error) => {
        console.error("Error loading PDF:", error);
        setIsLoading(false);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

    if (!research) {
        return <p>Loading...</p>;
    }

    return (
        <div className="uMain-cont">
            <div className="flex w-full gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm">
            <div className="flex-1">
                    <h3 className="text-2xl font-ZenSerif">{research.title}</h3>
                    <div className="text-md text-gray-700 mt-1 space-y-1">
                        <p><b>Authors:</b> {research.author.join(", ")}</p>
                        <p><b>Published:</b> {research.pubDate}</p>
                        <span>
                            <p><b>College:</b> {research.college}&nbsp;&nbsp;
                                {research.department && research.department !== "N/A" && (
                                    <>
                                        <b>Department:</b> {research.department}
                                    </>
                                )}
                            </p>
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                        {research.abstract || "No abstract available"}
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-grey p-2">
                <h3 className="text-2xl font-semibold mt-4 mb-2">Full Text Preview</h3>
                <div className="h-100 p-2.5 flex justify-center items-center">
                    {research.pdf ? (
                        <div className="p-2.5 pdf-viewer flex justify-center border border-grey rounded-lg" style={{ height: "725px" }}>
                            {isLoading && (
                                <div className="absolute flex justify-center items-center w-full h-full bg-gray-100 opacity-75">
                                    <div className="loader"></div>
                                </div>
                            )}
                            <Document
                                file={research.pdf}
                                loading="Loading PDF..."
                                onLoadSuccess={onLoadSuccess}
                                onLoadError={onLoadError}
                            >
                                <Page pageNumber={pageNumber} height={700} />
                            </Document>
                        </div>
                    ) : (
                        <p className="text-gray-500">No full-text preview available.</p>
                    )}
                </div>

                {research.pdf && numPages && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="uPage-btn px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50">
                            Previous
                        </button>
                        <span className="items-center flex text-sm font-medium">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="uPage-btn px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
