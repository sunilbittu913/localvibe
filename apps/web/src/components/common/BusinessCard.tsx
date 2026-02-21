import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle } from 'lucide-react';

interface BusinessCardProps {
  business: {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description: string | null;
    city: string | null;
    state: string | null;
    logo: string | null;
    coverImage: string | null;
    averageRating: string;
    totalReviews: number;
    isVerified: boolean;
    openingTime: string | null;
    closingTime: string | null;
    categoryId: number;
  };
  categoryName?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, categoryName }) => {
  const rating = parseFloat(business.averageRating) || 0;

  return (
    <Link
      to={`/business/${business.uuid}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
        {business.coverImage ? (
          <img src={business.coverImage} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">{business.name[0]}</span>
            </div>
          </div>
        )}
        {business.isVerified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-medium text-green-700">Verified</span>
          </div>
        )}
        {categoryName && (
          <div className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-xs font-medium text-white">{categoryName}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-1">
            {business.name}
          </h3>
          {rating > 0 && (
            <div className="flex items-center space-x-1 ml-2 shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({business.totalReviews})</span>
            </div>
          )}
        </div>

        {business.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{business.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          {(business.city || business.state) && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{[business.city, business.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {business.openingTime && business.closingTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{business.openingTime} - {business.closingTime}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
