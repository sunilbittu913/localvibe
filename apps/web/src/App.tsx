import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const BusinessProfilePage = lazy(() => import('./pages/BusinessProfilePage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => <LoadingSpinner className="min-h-screen" size="lg" />;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/business/:id" element={<BusinessProfilePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
