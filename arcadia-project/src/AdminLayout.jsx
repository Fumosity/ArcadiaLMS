import React from 'react';
import Header from './components/main-comp/Header';
import Footer from './components/main-comp/Footer';
import Copyright from './components/main-comp/Copyright';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Copyright />
    </>
  );
};

export default AdminLayout;
