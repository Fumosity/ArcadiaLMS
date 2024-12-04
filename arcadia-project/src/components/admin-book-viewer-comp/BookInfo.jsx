import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookInfo = ({ book }) => { // Accept book as a prop
  if (!book) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <Skeleton height={30} width={250} className="mb-2" />
        <Skeleton height={20} width={150} className="mb-4" />
        <Skeleton height={20} width={'100%'} className="mb-2" />
        <Skeleton height={20} width={'100%'} className="mb-2" />
        <Skeleton height={20} width={'80%'} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-3xl font-medium mb-2 font-ZenSerif">{book.title}</h3>
      <p className="text-gray-600 text-xl mb-4">By {book.author}</p>
      <h4 className="font-semibold mb-2">Synopsis:</h4>
      <p className="text-sm text-gray-700">{book.synopsis}</p>
    </div>
  ); 
};

export default BookInfo;
  