import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LandingPage from '../pages/LandingPage';
import LoginPopUp from '../components/ui/LoginPopUp';
import ProtectedRoute from './protectedroutes';
import HomeContent from '../components/common/HomeContent';
import ForumContent from '../components/common/ForumContent';
import Saved from '../components/common/SavedContent';
import Drafts from '../components/common/DraftContent';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomeContent />} />
        <Route path="forum" element={<ForumContent />} />
        <Route path="saved" element={<Saved />} />
        <Route path="draft" element={<Drafts />} />
      </Route>
      <Route path="/landingpage" element={<LandingPage />} />
    </>,
  ),
);

export default router;
