import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { ForumProvider } from './context/ForumContext';
import { NotificationProvider } from './context/NotificationContext';
import { PostProvider } from './context/PostContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ForumProvider>
      <NotificationProvider>
        <PostProvider>
          <App />
        </PostProvider>
      </NotificationProvider>
    </ForumProvider>
  </AuthProvider>,
);
