import React from 'react';
import Header from './components/main-comp/Header';
import Navbar from './components/main-comp/Navbar';
import AHomePage from './admin-home-page/AHomePage';
import ALibAnal from './admin-lib-analytics/ALibAnal';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Header/>
      <Navbar />
      <Routes>
        <Route path="/" element={<AHomePage />} />
        <Route path="/analytics" element={<ALibAnal />} />
      </Routes>
    </>
  )
}

export default App;