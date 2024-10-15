import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import ABAdding from "../components/admin-book-add-comp/ABAdding";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import Title from "../components/main-comp/Title";

const ABAdd = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    <Navbar />
    <Title>Book Adding</Title>
    <main className="flex justify-center items-start space-x-2 pb-12 py-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Main content for adding research */}
          <ABAdding />
        </div>
        {/* Preview section */}
        <div className="lg:col-span-1 space-y-8">
          <ABAddPreview />
        </div>
      </div>
    </main>

    <footer className="bg-light-gray mt-12 py-8">
      <Footer />
    </footer>
    <Copyright />
  </div>
);

export default ABAdd;
