import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style.css';
import Home from './pages/Home';
import About from './pages/About';
import Dashbordlayout from './layout/Dashbordlayout';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashbordlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(
  <div>
    <RouterProvider router={router} />
  </div>,
);
