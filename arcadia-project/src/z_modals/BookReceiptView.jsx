import React, { useState } from 'react';

const BookReceiptView = ({ isOpen, onClose, onConfirm, content }) => {
    if (!isOpen) return null;

    console.log(content);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-5/6 p-8">
                <h2 className="text-xl font-semibold mb-4 text-center">Book Transaction</h2>
                <hr className="mb-2 border-t-2 border-gray-300" />

                <div className='flex'>
                    <div className='flex flex-col justify-start w-full'>
                        <h3 className="text-lg font-semibold mb-2">Borrower Details</h3>
                        <div className="flex justify-start gap-2">
                            <div><strong>Borrower:</strong></div>
                            <div>{content.borrower}</div>
                        </div>
                        <div className="flex justify-start gap-2">
                            <div><strong>School No.:</strong></div>
                            <div>{content.schoolNo}</div>
                        </div>
                        <div className="flex justify-start gap-2">
                            <div><strong>College:</strong></div>
                            <div>{content.college} {content.department ? ` - ${content.department}` : ""}</div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-start w-full'>
                        <h3 className="text-lg font-semibold mb-2">Book Details</h3>

                        <div className="flex justify-start gap-2">
                            <div><strong>Book Title:</strong></div>
                            <div>{content.bookTitle}</div>
                        </div>
                        <div className="flex justify-start gap-2">
                            <div><strong>Barcode:</strong></div>
                            <div>{content.bookBarcode}</div>
                        </div>
                        <div className="flex justify-start gap-2">
                            <div><strong>Deadline:</strong></div>
                            <div>{content.deadline}</div>
                        </div>
                    </div>
                </div>

                <hr className="my-2 border-t border-gray-300" />
                <div className='flex flex-row justify-between'>
                    <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                    <p className="text-md text-left my-0">Transaction No.: {content.transNo}</p>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {content.type === 'Borrowed' && (
                            <tr>
                                <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                                    <span
                                        className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 
                                            ${content.type === "Returned" ? "bg-resolved text-white" : content.type === "Borrowed" ? "bg-ongoing" : "bg-grey"}`}
                                    >
                                        {content.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.dateOut}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.checkoutTime || content.time}</td> {/* Use checkoutTime if available, otherwise use time */}
                            </tr>
                        )}
                        {content.type === 'Returned' && (
                            <>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                    <span
                                        className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 bg-ongoing`}
                                    >
                                        Borrowed
                                        </span>
                                        </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.dateOut}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.checkoutTime || content.time}</td> {/* Use checkoutTime if available, otherwise use time */}
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                    <span
                                        className={`inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1 bg-resolved text-white`}
                                    >
                                        Returned
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.dateIn}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{content.checkinTime}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>

                <hr className="mb-4 border-t border-gray-300" />

                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        className="penBtn px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        onClick={onConfirm}
                    >
                        Print
                    </button>
                    <button
                        className="cancelModify px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookReceiptView;