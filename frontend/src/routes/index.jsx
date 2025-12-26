/**
 * Routes Configuration
 *
 * Centralized route definitions with lazy loading for code splitting
 */

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import AppLayout from './AppLayout';
import AuthLayout from './AuthLayout';

// Lazy load views for code splitting
const NewDashboardView = lazy(() => import('../views/NewDashboardView'));
const LearnView = lazy(() => import('../views/LearnView'));
const ChapterPageView = lazy(() => import('../views/ChapterPageView'));
const StudyTogetherView = lazy(() => import('../views/StudyTogetherView'));
const ReviewView = lazy(() => import('../views/ReviewView'));
const ProfileView = lazy(() => import('../views/ProfileView'));
const LoginView = lazy(() => import('../views/LoginView'));
const RegisterView = lazy(() => import('../views/RegisterView'));
const ParentEntryView = lazy(() => import('../views/ParentEntryView'));

// Suspense wrapper for lazy-loaded components
const LazyRoute = ({ component: Component, ...props }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

// Route configuration
export const routes = [
  // Auth routes (public)
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LazyRoute component={LoginView} />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <LazyRoute component={RegisterView} />
      </AuthLayout>
    ),
  },
  {
    path: '/parent',
    element: (
      <AuthLayout>
        <LazyRoute component={ParentEntryView} />
      </AuthLayout>
    ),
  },

  // App routes (protected)
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LazyRoute component={NewDashboardView} />,
      },
      {
        path: 'dashboard',
        element: <LazyRoute component={NewDashboardView} />,
      },
      {
        path: 'learn',
        element: <LazyRoute component={LearnView} />,
      },
      {
        path: 'learn/chapter/:chapterId',
        element: <LazyRoute component={ChapterPageView} />,
      },
      {
        path: 'learn/chapter/:chapterId/study',
        element: <LazyRoute component={StudyTogetherView} />,
      },
      {
        path: 'review',
        element: <LazyRoute component={ReviewView} />,
      },
      {
        path: 'profile',
        element: <LazyRoute component={ProfileView} />,
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

// Create router instance
export const router = createBrowserRouter(routes);

export default router;
