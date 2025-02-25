import React, { useState } from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import ABAdding from "../components/admin-book-add-comp/ABAdding";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import Title from "../components/main-comp/Title";

const ABAdd = () => {
const [formData, setFormData] = useState({
  title: '',
  author: [],
  genre: [],
  category: [],
  publisher: '',
  synopsis: '',
  keyword: [],
  currentPubDate: '',
  originalPubDate: '',
  procurementDate: '',
  location: '',
  bookID: '',
  bookARCID: '',
  bookBarcode: '',
  isbn: '',
  cover: '',
  price: '',
  titleARCID: '',
})

  return(
    <div className="min-h-screen bg-gray-100">
      <Title>Book Adding</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Main content for adding research */}
            <ABAdding formData={formData} setFormData={setFormData} />
          </div>
          {/* Preview section */}
          <div className="lg:col-span-1 space-y-8">
            <ABAddPreview formData={formData}/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ABAdd;
