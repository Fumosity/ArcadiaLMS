import React from 'react';
import UHeader from './components/UserComponents/user-main-comp/UHeader';
import UFooter from './components/UserComponents/user-main-comp/UFooter';
import UCopyright from './components/UserComponents/user-main-comp/UCopyright';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
      <UHeader />
      <Outlet />
      <UFooter />
      <UCopyright />
    </>
  );
};

export default UserLayout;
