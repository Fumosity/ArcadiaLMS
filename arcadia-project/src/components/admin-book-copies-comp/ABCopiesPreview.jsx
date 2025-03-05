import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ABCopiesPreview = ({ book }) => {

  if (!book)
    return (
      <div className="bg-white p-4 rounded-lg border-grey border w-full mt-12">
        <Skeleton height={20} width={150} className="mb-2" />
        <Skeleton height={200} className="mb-2" />
        <Skeleton count={8} className="mb-1" />
        <Skeleton width={100} height={25} className="mt-2" />
        <Skeleton width={100} height={25} className="mt-2" />
      </div>
    );

  const bookDetails = {
    title: book.title,
    author: Array.isArray(book.author) ? book.author.join(', ') : (book.author ?? '').split(';').join(',') || '',
    genres: Array.isArray(book.genres) ? book.genres.join(', ') : (book.genres ?? '').split(';').join(',') || '',
    category: book.category,
    publisher: book.publisher,
    synopsis: book.synopsis,
    keywords: Array.isArray(book.keywords) ? book.keywords.join(', ') : (book.keywords ?? '').split(';').join(',') || '',
    currdatePublished: book.currentPubDate,
    orgdatePublished: book.currentPubDate,
    location: book.location,
    isbn: book.isbn,
    cover: book.cover,
    price: book.price,
  };

  return (
    <div className='mt-12'>    
      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-2">About</h3>
        <div className="w-full h-fit flex justify-center">
          <div className="relative bg-white p-4 w-fit rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md border border-grey">
            <img
              src={bookDetails.cover && bookDetails.cover !== ""
                ? bookDetails.cover
                : "../image/book_research_placeholder.png"}
              alt="Book cover"
              className="h-[475px] w-[300px] rounded-lg border border-grey object-cover" />
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(bookDetails)
              .filter(([key]) => !["cover"].includes(key)) // Exclude multiple keys
              .map(([key, value], index) => (
                <tr key={index} className="border-b border-grey">
                  <td
                    className="px-1 py-1 font-semibold capitalize w-1/3"
                  >
                    {key === "currdatePublished"
                      ? "Current Pub. Date:"
                      : key === "orgdatePublished"
                        ? "Original Pub. Date:"
                        : key === "isbn"
                          ? "ISBN:"
                          : key === "arcID"
                            ? "ARC ID:"
                            : key.replace(/([A-Z])/g, " $1") + ":"}
                  </td>
                  <td
                    className="px-1 py-1 text-sm break-words w-2/3"
                  >
                    {value}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ABCopiesPreview;
