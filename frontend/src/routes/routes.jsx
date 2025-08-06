import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LandingPage from '../pages/LandingPage';
import { ProtectedRoute, PublicRoute } from './protectedroutes';
import HomeContent from '../components/common/nav/asidebar/HomeContent';
import ForumContent from '../components/common/nav/asidebar/ForumContent';
import Saved from '../components/common/nav/asidebar/SavedContent';

import Threads from '../components/common/nav/home/Threads';
import { ForumHomePage, ForumDefault } from '../pages/ForumHomePage';
import PostContent from '../pages/PostContent';
import { PostProvider } from '../context/PostContext';
import { CommentProvider } from '../context/CommnentContext';

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
          <Route index element={<Navigate to="mythreads" replace />} />
          <Route path="mythreads" element={<Threads />} />
        </Route>
        <Route path="forum" element={<ForumContent />} />
        <Route path="saved" element={<Saved />} />
      </Route>
      <Route
        path="/b/:forumTitle"
        element={
          <PostProvider>
            {' '}
            <ForumHomePage />{' '}
          </PostProvider>
        }
      >
        <Route index element={<ForumDefault />} />
        <Route
          path=":postId"
          element={
            <CommentProvider>
              <PostContent />{' '}
            </CommentProvider>
          }
        />
      </Route>
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
