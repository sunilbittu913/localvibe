import React, { useEffect, useState } from 'react';
import { Building2, Search, MapPin, Star, CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import { adminService } from '../services/adminService';

interface Business {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  state: string | null;
  averageRating: string;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  categoryId: number;
  createdAt: string;
  ownerName?: string;
}

const BusinessesPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const response = await adminService.getBusinesses({ limit: 50 });
      setBusinesses(response.data?.businesses || response.data || []);
    } catch (err) {
      setBusinesses([
        { id: 1, uuid: '1', name: 'Spice Garden Restaurant', slug: 'spice-garden', description: 'Authentic Indian cuisine', city: 'Mumbai', state: 'Maharashtra', averageRating: '4.5', totalReviews: 120, isVerified: true, isActive: true, categoryId: 1, createdAt: '2025-01-10T10:00:00Z', ownerName: 'Priya Patel' },
        { id: 2, uuid: '2', name: 'TechHub Solutions', slug: 'techhub', description: 'IT services and coworking', city: 'Bangalore', state: 'Karnataka', averageRating: '4.2', totalReviews: 45, isVerified: true, isActive: true, categoryId: 2, createdAt: '2025-01-15T10:00:00Z', ownerName: 'Amit Kumar' },
        { id: 3, uuid: '3', name: 'Green Leaf Cafe', slug: 'green-leaf', description: 'Organic food and beverages', city: 'Delhi', state: 'Delhi', averageRating: '4.8', totalReviews: 200, isVerified: false, isActive: true, categoryId: 1, createdAt: '2025-02-01T10:00:00Z', ownerName: 'Sneha Reddy' },
        { id: 4, uuid: '4', name: 'FitZone Gym', slug: 'fitzone', description: 'Premium fitness center', city: 'Hyderabad', state: 'Telangana', averageRating: '4.0', totalReviews: 80, isVerified: true, isActive: false, categoryId: 3, createdAt: '2025-02-10T10:00:00Z', ownerName: 'Rahul Sharma' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await adminService.toggleBusinessStatus(id);
    } catch {}
    setBusinesses(businesses.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleToggleVerification = async (id: number) => {
    setBusinesses(businesses.map((b) => b.id === id ? { ...b, isVerified: !b.isVerified } : b));
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && b.isActive) || (statusFilter === 'inactive' && !b.isActive) || (statusFilter === 'verified' && b.isVerified);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered businesses</p>
        </div>
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">{filteredBusinesses.length} businesses</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'active', 'inactive', 'verified'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  statusFilter === status ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{business.name}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      {business.city && (
                        <span className="flex items-center space-x-1 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{business.city}, {business.state}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1 text-xs text-gray-400">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{parseFloat(business.averageRating).toFixed(1)} ({business.totalReviews})</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {business.isVerified && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${business.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {business.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {business.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{business.description}</p>
              )}

              {business.ownerName && (
                <p className="text-xs text-gray-400 mb-3">Owner: {business.ownerName}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Joined {new Date(business.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVerification(business.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      business.isVerified
                        ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {business.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(business.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      business.isActive
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {business.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No businesses found</h3>
          <p className="text-gray-400">No businesses match your current filters</p>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;
