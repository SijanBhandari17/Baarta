import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { ForumProvider } from './context/ForumContext';
import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ForumProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ForumProvider>
  </AuthProvider>,
);
