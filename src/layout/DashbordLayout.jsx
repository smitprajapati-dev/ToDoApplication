import React from 'react';
import { Outlet } from 'react-router-dom';
// import Footer from '../containers/Footer';
// import Header from '../containers/Header';

function Dashbordlayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Dashbordlayout;
