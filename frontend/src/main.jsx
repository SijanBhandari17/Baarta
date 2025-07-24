import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { ForumProvider } from './context/ForumContext';
import { PostProvider } from './context/PostCOntext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ForumProvider>
      <PostProvider>
        <App />
      </PostProvider>
    </ForumProvider>
  </AuthProvider>,
);
