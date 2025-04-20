import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookInfo = ({ book }) => { // Accept book as a prop
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


  if (!book) {
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
      <h3 className="text-3xl font-medium mb-2 font-ZenSerif">{book.title}</h3>
      <p className="text-gray-600 text-xl mb-4">By {formatAuthor(book.author)}</p>
      <h4 className="font-semibold mb-2 text-lg">Synopsis:</h4>
      <p className="text-md text-gray-700 whitespace-pre-line">{book.synopsis}</p>
    </div>
  );
};

export default BookInfo;
