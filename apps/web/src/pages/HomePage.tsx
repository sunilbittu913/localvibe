import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Tag, Star, ArrowRight, Building2, Users, TrendingUp, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchBusinesses, fetchCategories } from '../store/slices/businessSlice';
import BusinessCard from '../components/common/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { businesses, categories, loading } = useAppSelector((state) => state.business);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchBusinesses({ limit: 6, sortBy: 'averageRating', sortOrder: 'desc' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || '';
  };

  const stats = [
    { icon: Building2, label: 'Local Businesses', value: '5,000+' },
    { icon: Users, label: 'Active Users', value: '50,000+' },
    { icon: Star, label: 'Reviews', value: '100,000+' },
    { icon: TrendingUp, label: 'Monthly Visits', value: '1M+' },
  ];

  const features = [
    { icon: MapPin, title: 'Discover Nearby', description: 'Find businesses, services, and professionals in your area with our map-based discovery.', color: 'bg-primary-50 text-primary-500' },
    { icon: Briefcase, title: 'Job Opportunities', description: 'Search and apply for local job openings posted by businesses in your community.', color: 'bg-blue-50 text-blue-500' },
    { icon: Tag, title: 'Exclusive Deals', description: 'Access special offers and discounts from local businesses near you.', color: 'bg-green-50 text-green-500' },
    { icon: Shield, title: 'Verified Businesses', description: 'All businesses are verified to ensure quality and trustworthiness.', color: 'bg-purple-50 text-purple-500' },
  ];

  const popularCategories = [
    { name: 'Restaurants', icon: '🍽️', color: 'from-orange-400 to-red-500' },
    { name: 'Healthcare', icon: '🏥', color: 'from-green-400 to-emerald-500' },
    { name: 'Education', icon: '📚', color: 'from-blue-400 to-indigo-500' },
    { name: 'Shopping', icon: '🛍️', color: 'from-pink-400 to-rose-500' },
    { name: 'Services', icon: '🔧', color: 'from-yellow-400 to-amber-500' },
    { name: 'Entertainment', icon: '🎬', color: 'from-purple-400 to-violet-500' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover the Best <span className="text-yellow-300">Local Businesses</span> Near You
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Connect with local businesses, find exclusive deals, explore job opportunities, and be part of your community.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-full shadow-xl overflow-hidden p-1.5">
                <div className="flex-1 flex items-center pl-4">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants, salons, doctors..."
                    className="w-full py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-base"
                  />
                </div>
                <button type="submit" className="px-6 md:px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-colors text-sm md:text-base">
                  Search
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/discover" className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/25 transition-colors">
                <MapPin className="w-4 h-4 inline mr-1" /> Explore Map
              </Link>
              <Link to="/jobs" className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/25 transition-colors">
                <Briefcase className="w-4 h-4 inline mr-1" /> Find Jobs
              </Link>
              <Link to="/offers" className="px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/25 transition-colors">
                <Tag className="w-4 h-4 inline mr-1" /> View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Categories</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Browse businesses by category and find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/discover?category=${cat.name.toLowerCase()}`}
              className="group relative bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
              <p className="text-gray-500">Top-rated businesses in your area</p>
            </div>
            <Link to="/discover" className="hidden sm:flex items-center space-x-1 text-primary-500 font-medium hover:text-primary-600 transition-colors">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.slice(0, 6).map((business) => (
                <BusinessCard key={business.id} business={business} categoryName={getCategoryName(business.categoryId)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No businesses yet</h3>
              <p className="text-gray-400 mb-4">Be the first to list your business on LocalVibe</p>
              <Link to="/register" className="inline-flex items-center px-6 py-2.5 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors">
                List Your Business
              </Link>
            </div>
          )}

          <div className="sm:hidden text-center mt-6">
            <Link to="/discover" className="inline-flex items-center space-x-1 text-primary-500 font-medium">
              <span>View All Businesses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose LocalVibe?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Everything you need to connect with your local community</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of local businesses already thriving on LocalVibe. Create your free profile today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">
              Get Started Free
            </Link>
            <Link to="/discover" className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Explore Businesses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
