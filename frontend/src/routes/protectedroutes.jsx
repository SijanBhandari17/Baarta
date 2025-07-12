import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Only redirect if we're sure user is not authenticated
  if (!user) {
    return <Navigate to="/landingpage" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Only redirect if we're sure user is authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
