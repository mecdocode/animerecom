import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load non-critical pages for better performance
const Quiz = lazy(() => import('./pages/Quiz'));
const Search = lazy(() => import('./pages/Search'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const AnimeDetails = lazy(() => import('./pages/AnimeDetails'));

// Create a client for React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      cacheTime: 30 * 60 * 1000, // 30 minutes - increased cache time
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      suspense: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900"></div>
  </div>
);

// Component to handle route animations with lazy loading
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={
          <Suspense fallback={<PageLoader />}>
            <Quiz />
          </Suspense>
        } />
        <Route path="/search" element={
          <Suspense fallback={<PageLoader />}>
            <Search />
          </Suspense>
        } />
        <Route path="/recommend" element={
          <Suspense fallback={<PageLoader />}>
            <Recommendations />
          </Suspense>
        } />
        <Route path="/anime/:id" element={
          <Suspense fallback={<PageLoader />}>
            <AnimeDetails />
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-paper-50 bg-paper-texture">
              <AppShell>
                <AnimatedRoutes />
              </AppShell>
            </div>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
