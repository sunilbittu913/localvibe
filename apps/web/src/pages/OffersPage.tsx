import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Percent, Gift, Search, Copy, CheckCircle, ArrowRight, Ticket } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchOffers } from '../store/slices/businessSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const discountTypeLabels: Record<string, string> = {
  percentage: '% Off',
  flat: 'Flat Off',
  bogo: 'Buy 1 Get 1',
  freebie: 'Freebie',
};

const OffersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { offers, loading } = useAppSelector((state) => state.business);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchOffers({}));
  }, [dispatch]);

  const filteredOffers = offers.filter((offer: any) => {
    if (!searchQuery) return true;
    return offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) || offer.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountDisplay = (offer: any) => {
    if (offer.discountType === 'percentage' && offer.discountValue) return `${offer.discountValue}% OFF`;
    if (offer.discountType === 'flat' && offer.discountValue) return `₹${Number(offer.discountValue).toLocaleString('en-IN')} OFF`;
    if (offer.discountType === 'bogo') return 'BOGO';
    if (offer.discountType === 'freebie') return 'FREE';
    return 'DEAL';
  };

  const getDiscountColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'from-orange-500 to-red-500';
      case 'flat': return 'from-green-500 to-emerald-600';
      case 'bogo': return 'from-purple-500 to-indigo-600';
      case 'freebie': return 'from-blue-500 to-cyan-500';
      default: return 'from-primary-500 to-orange-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-red-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Offers & Deals</h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Exclusive discounts and deals from local businesses near you
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search offers and deals..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">{filteredOffers.length} offers available</p>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer: any) => (
              <div key={offer.id || offer.uuid} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Discount Badge */}
                <div className={`bg-gradient-to-r ${getDiscountColor(offer.discountType)} p-6 text-center`}>
                  <div className="text-3xl font-extrabold text-white mb-1">{getDiscountDisplay(offer)}</div>
                  <p className="text-white/80 text-sm">{discountTypeLabels[offer.discountType] || 'Special Deal'}</p>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{offer.description}</p>
                  )}

                  {/* Coupon Code */}
                  {offer.couponCode && (
                    <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 mb-4">
                      <code className="text-sm font-bold text-gray-800 tracking-wider">{offer.couponCode}</code>
                      <button
                        onClick={() => copyCode(offer.couponCode)}
                        className="flex items-center space-x-1 text-primary-500 hover:text-primary-600 text-sm font-medium"
                      >
                        {copiedCode === offer.couponCode ? (
                          <><CheckCircle className="w-4 h-4" /><span>Copied!</span></>
                        ) : (
                          <><Copy className="w-4 h-4" /><span>Copy</span></>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-500">
                    {offer.minOrderValue && (
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-4 h-4 text-gray-400" />
                        <span>Min. order: ₹{Number(offer.minOrderValue).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {offer.maxDiscount && (
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-gray-400" />
                        <span>Max discount: ₹{Number(offer.maxDiscount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {offer.expiresAt && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Expires: {new Date(offer.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No offers available</h3>
            <p className="text-gray-400 mb-6">Check back later for new deals</p>
            <Link to="/discover" className="inline-flex items-center text-primary-500 font-medium">
              <span>Browse Businesses</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
