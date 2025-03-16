import * as React from "react";
import { ChevronDown } from "lucide-react";

// Define the FAQ data array
const faqData = [
  {
    question: "How do I look for books?",
    answer: "Simply use the search bar to look for a specific book through their title or a related keyword. A few other ways would be to look at the Recommended for You, Highly Rated, and Most Popular sections located in the Arcadia home page.",
  },
  {
    question: "How do I look for researches?",
    answer: "You can find research papers and academic materials through our dedicated research section or by using advanced search filters to narrow down to research-specific content.",
  },
  {
    question: "How do I contact the ARC staff?",
    answer: "You can reach the ARC staff through our help desk during operating hours, or by using the contact form in the Support section of the website.",
  },
  {
    question: "Why can't I access Arcadia outside of the school premises?",
    answer: "Access to Arcadia is restricted to school premises for security and licensing reasons. However, certain resources may be available remotely with proper authentication.",
  },
  {
    question: "Why can't I find the book that I am looking for?",
    answer: "If you cannot find a specific book, it might be currently checked out, in processing, or not part of our collection. Please check with the library staff for assistance or to place a hold.",
  },
  {
    question: "Can I suggest for books that the library could add?",
    answer: "Yes! We welcome book suggestions from our community. You can submit your recommendations through the Book Suggestion form in your library account or speak with a librarian.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="uMain-cont">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <div key={index} className="max-w-[1240px] border border-grey rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-content-${index}`}
            >
              {/* Conditionally apply text-red-500 when this question is open */}
              <span className={`text-lg font-semibold ${openIndex === index ? "text-a-t-red" : ""}`}>
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`faq-content-${index}`}
              className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="pb-3 pt-1">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
