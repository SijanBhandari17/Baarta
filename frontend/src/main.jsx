import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import router from './routes/routes';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
