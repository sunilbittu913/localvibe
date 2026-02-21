import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AdminLayout from './components/layout/AdminLayout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PostsPage = lazy(() => import('./pages/PostsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const BusinessesPage = lazy(() => import('./pages/BusinessesPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ModerationPage = lazy(() => import('./pages/ModerationPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/businesses" element={<BusinessesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/moderation" element={<ModerationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
