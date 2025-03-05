import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf"; // Import react-pdf components
import { GlobalWorkerOptions } from 'pdfjs-dist';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the worker source explicitly
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/pdf.worker.min.mjs';

const ARFullText = ({ researchData }) => {
    const {
        title,
        author,
        college,
        department,
        abstract,
        pages,
        keyword,
        pubDate,
        location,
        researchID,
        researchARCID,
        cover,
        pdf,
    } = researchData || {};

    const [pageNumber, setPageNumber] = useState(1); // Current page
    const [numPages, setNumPages] = useState(10);  // Limit to 10 pages
    const [isLoading, setIsLoading] = useState(false);  // Loading state

    const onLoadSuccess = ({ numPages }) => {
        setNumPages(Math.min(numPages, 10)); // Limit to 10 pages
        setIsLoading(false);  // Set loading state to false once the document is loaded
    };

    const onLoadError = (error) => {
        console.error("Error loading PDF: ", error);
        setIsLoading(false);  // Stop loading if there is an error
    };

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, 10)); // Limit to 10 pages
    };

    useEffect(() => {
        setPageNumber(1); // Reset to first page if pdf changes
        setIsLoading(true);  // Set loading state to true when PDF changes
    }, [pdf]);

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <div className="space-y-4 flex-col justify-center items-center">
                <h3 className="text-2xl font-semibold mb-4">Full Text Preview</h3>
                <p className="text-gray-600 mb-8">
                    Preview the first ten pages of this research paper.
                </p>
                <div className="h-100 p-2.5 flex justify-center items-center">
                    {pdf ? (
                        <div className="p-2.5 pdf-viewer flex justify-center border border-grey rounded-lg" style={{ height: '725px' }}>
                            {/* Loading Spinner */}
                            {isLoading && (
                                <div className="absolute flex justify-center items-center w-full h-full bg-gray-100 opacity-75">
                                    <div className="loader"></div>
                                </div>
                            )}
                            <Document
                                file={pdf}
                                loading="Loading PDF..."
                                onLoadSuccess={onLoadSuccess}
                                onLoadError={onLoadError}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    height={700} // Keep the height fixed
                                />
                            </Document>
                        </div>
                    ) : (
                        <p className="text-gray-500">This research paper does not have a full text preview available.</p>
                    )}
                </div>

                {/* Pagination Controls */}
                {pdf && numPages && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className="uPage-btn px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="items-center flex text-sm font-medium">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            className="uPage-btn px-4 py-2 bg-gray-200 text-sm rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ARFullText;
