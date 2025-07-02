import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
const isAuthenticated = false;

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAuthenticated ? <Dashboard /> : <LandingPage />}</StrictMode>,
);

export default isAuthenticated;
