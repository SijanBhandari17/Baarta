import { useAuth } from './context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import LoadingSpinner from './components/common/LoadingSpinner';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return <RouterProvider router={router} />;
}
