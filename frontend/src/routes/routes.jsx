import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LandingPage from '../pages/LandingPage';
import { ProtectedRoute, PublicRoute } from './protectedroutes';
import HomeContent from '../components/common/nav/asidebar/HomeContent';
import ForumContent from '../components/common/nav/asidebar/ForumContent';
import Saved from '../components/common/nav/asidebar/SavedContent';
import Drafts from '../components/common/nav/asidebar/DraftContent';

import LiveDiscussions from '../components/common/nav/home/LiveDiscussions';
import Threads from '../components/common/nav/home/Threads';
import Trending from '../components/common/nav/home/Trending';
import UpcommingEventInfo from '../pages/UpcommingEvents';

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
        <Route path="home" element={<HomeContent />}>
          <Route index element={<Navigate to="livediscussions" replace />} />
          <Route path="livediscussions" element={<LiveDiscussions />} />
          <Route path="mythreads" element={<Threads />} />
          <Route path="trending" element={<Trending />} />
        </Route>
        <Route path="forum" element={<ForumContent />} />
        <Route path="saved" element={<Saved />} />
        <Route path="draft" element={<Drafts />} />
      </Route>
      <Route path="upcommingevents" element={<UpcommingEventInfo />} />
      <Route
        path="/landingpage"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
    </>,
  ),
);

export default router;
