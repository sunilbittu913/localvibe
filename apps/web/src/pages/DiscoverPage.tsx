import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, List, Grid3X3, Filter, X, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchBusinesses, fetchCategories } from '../store/slices/businessSlice';
import BusinessCard from '../components/common/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DiscoverPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, categories, loading, pagination } = useAppSelector((state) => state.business);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || '',
    city: searchParams.get('city') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params: Record<string, any> = { page: filters.page, limit: 12, sortBy: filters.sortBy, sortOrder: filters.sortOrder };
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = Number(filters.categoryId);
    if (filters.city) params.city = filters.city;
    dispatch(fetchBusinesses(params));
  }, [dispatch, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const getCategoryName = (categoryId: number) => categories.find((c) => c.id === categoryId)?.name || '';

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Businesses</h1>
              <p className="text-gray-500 text-sm mt-1">Find local businesses and services near you</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-primary-500' : 'text-gray-400'}`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, category, or location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="averageRating">Highest Rated</option>
                    <option value="totalReviews">Most Reviewed</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc', page: 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setFilters({ search: '', categoryId: '', city: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1 })}
                className="mt-3 text-sm text-primary-500 font-medium hover:text-primary-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'map' ? (
          /* Map View */
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Map View</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Interactive map showing {businesses.length} businesses in your area. Integration with Google Maps or Leaflet coming soon.
                </p>
                {businesses.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {businesses.slice(0, 4).map((b) => (
                      <div key={b.id} className="flex items-center space-x-2 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary-600">{b.name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{b.name}</p>
                          <p className="text-xs text-gray-400">{b.city || 'Location N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List/Grid View */
          <>
            {loading ? (
              <LoadingSpinner className="py-20" />
            ) : businesses.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-6">{pagination.total || businesses.length} businesses found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} categoryName={getCategoryName(business.categoryId)} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-10 space-x-2">
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters({ ...filters, page })}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          filters.page === page ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No businesses found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
