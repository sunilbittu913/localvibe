import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, Star, CheckCircle, ArrowLeft, Share2, Heart, MessageCircle, Calendar, Navigation } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchBusinessById } from '../store/slices/businessSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BusinessProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentBusiness: business, loading, categories } = useAppSelector((state) => state.business);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'jobs' | 'offers'>('about');

  useEffect(() => {
    if (id) dispatch(fetchBusinessById(id));
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner className="py-32" size="lg" />;

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Business Not Found</h2>
        <p className="text-gray-500 mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <Link to="/discover" className="inline-flex items-center px-6 py-2.5 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discover
        </Link>
      </div>
    );
  }

  const rating = parseFloat(business.averageRating) || 0;
  const categoryName = categories.find((c) => c.id === business.categoryId)?.name || '';

  const tabs = [
    { key: 'about', label: 'About' },
    { key: 'reviews', label: `Reviews (${business.totalReviews})` },
    { key: 'jobs', label: 'Jobs' },
    { key: 'offers', label: 'Offers' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-400 to-orange-500">
        {business.coverImage && (
          <img src={business.coverImage} alt={business.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 left-4">
          <Link to="/discover" className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
              {business.logo ? (
                <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-3xl font-bold text-primary-600">{business.name[0]}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{business.name}</h1>
                {business.isVerified && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {categoryName && (
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-3">
                  {categoryName}
                </span>
              )}

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({business.totalReviews} reviews)</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {(business.city || business.state) && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{[business.addressLine1, business.city, business.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {business.openingTime && business.closingTime && (
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{business.openingTime} - {business.closingTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
              )}
              <button className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {business.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">{business.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {business.phone && (
                        <div className="flex items-center space-x-3 text-sm">
                          <Phone className="w-4 h-4 text-primary-500" />
                          <a href={`tel:${business.phone}`} className="text-gray-600 hover:text-primary-500">{business.phone}</a>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center space-x-3 text-sm">
                          <Mail className="w-4 h-4 text-primary-500" />
                          <a href={`mailto:${business.email}`} className="text-gray-600 hover:text-primary-500">{business.email}</a>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center space-x-3 text-sm">
                          <Globe className="w-4 h-4 text-primary-500" />
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-500">{business.website}</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                    <div className="space-y-2">
                      {business.openingTime && business.closingTime && (
                        <div className="flex items-center space-x-3 text-sm">
                          <Clock className="w-4 h-4 text-primary-500" />
                          <span className="text-gray-600">{business.openingTime} - {business.closingTime}</span>
                        </div>
                      )}
                      {business.workingDays && (
                        <div className="flex items-center space-x-3 text-sm">
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span className="text-gray-600">{business.workingDays}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {(business.latitude && business.longitude) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <div className="text-center">
                        <Navigation className="w-10 h-10 text-primary-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Map integration coming soon</p>
                        <p className="text-xs text-gray-400 mt-1">{business.latitude}, {business.longitude}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Reviews</h3>
                <p className="text-gray-400">Customer reviews will appear here</p>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Job Openings</h3>
                <p className="text-gray-400">Job postings from this business will appear here</p>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Offers & Deals</h3>
                <p className="text-gray-400">Special offers from this business will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default BusinessProfilePage;
