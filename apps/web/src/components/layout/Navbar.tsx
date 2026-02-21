import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { Menu, X, Search, User, LogOut, ChevronDown, MapPin, Briefcase, Tag, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Local<span className="text-primary-500">Vibe</span></span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, services, jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/discover" className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
              <MapPin className="w-4 h-4" />
              <span>Discover</span>
            </Link>
            <Link to="/jobs" className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
            </Link>
            <Link to="/offers" className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
              <Tag className="w-4 h-4" />
              <span>Deals</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-500">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <form onSubmit={handleSearch} className="px-4 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, services..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
          </form>
          <div className="mt-3 space-y-1 px-4">
            <Link to="/discover" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400" /><span>Discover</span>
            </Link>
            <Link to="/jobs" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-gray-400" /><span>Jobs</span>
            </Link>
            <Link to="/offers" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
              <Tag className="w-5 h-5 text-gray-400" /><span>Deals</span>
            </Link>
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg">
                    <LayoutDashboard className="w-5 h-5 text-gray-400" /><span>Dashboard</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-5 h-5" /><span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex space-x-2 px-3 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
