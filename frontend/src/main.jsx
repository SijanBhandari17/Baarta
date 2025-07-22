import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { ForumProvider } from './context/ForumContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ForumProvider>
      <App />
    </ForumProvider>
  </AuthProvider>,
);
