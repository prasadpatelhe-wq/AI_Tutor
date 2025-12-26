/**
 * AppWithRouter - New Application Entry Point
 *
 * Uses React Router for navigation and React Query for data fetching.
 * This is the new architecture entry point that can be used when migration is complete.
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { SyllabusProvider } from './SyllabusContext';
import { router } from './routes';
import { queryClient } from './api/queryClient';

const AppWithRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SyllabusProvider>
        <RouterProvider router={router} />
      </SyllabusProvider>
    </QueryClientProvider>
  );
};

export default AppWithRouter;
