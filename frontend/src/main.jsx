// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import StartScan from './pages/StartScan';
import ScanDetails from './pages/ScanDetails';
import ScanHistory from './pages/ScanHistory';
import DashboardLayout from './components/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'scan', element: <StartScan /> },
      { path: 'scan/:scanId', element: <ScanDetails /> },
      { path: 'history', element: <ScanHistory /> },
      { 
        path: 'dashboard',
        element: <DashboardLayout />,
        errorElement: <ErrorBoundary />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);