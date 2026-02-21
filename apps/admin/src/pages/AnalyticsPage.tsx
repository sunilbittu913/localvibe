import React from 'react';
import { BarChart3, TrendingUp, Users, Building2, Eye, ArrowUpRight, ArrowDownRight, Globe, Smartphone } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const metrics = [
    { label: 'Page Views', value: '125,430', change: '+18.2%', trend: 'up', icon: Eye, color: 'bg-blue-500' },
    { label: 'New Users', value: '2,340', change: '+12.5%', trend: 'up', icon: Users, color: 'bg-green-500' },
    { label: 'Business Signups', value: '156', change: '+8.3%', trend: 'up', icon: Building2, color: 'bg-purple-500' },
    { label: 'Bounce Rate', value: '32.4%', change: '-2.1%', trend: 'down', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const topBusinesses = [
    { name: 'Spice Garden Restaurant', views: 12500, rating: 4.8, growth: '+15%' },
    { name: 'TechHub Coworking', views: 9800, rating: 4.5, growth: '+22%' },
    { name: 'Green Leaf Cafe', views: 8700, rating: 4.9, growth: '+10%' },
    { name: 'FitZone Gym', views: 7200, rating: 4.2, growth: '+18%' },
    { name: 'City Hospital', views: 6500, rating: 4.6, growth: '+5%' },
  ];

  const topCategories = [
    { name: 'Restaurants', businesses: 145, percentage: 28 },
    { name: 'Healthcare', businesses: 98, percentage: 19 },
    { name: 'Shopping', businesses: 87, percentage: 17 },
    { name: 'Services', businesses: 76, percentage: 15 },
    { name: 'Education', businesses: 54, percentage: 11 },
    { name: 'Others', businesses: 52, percentage: 10 },
  ];

  const trafficSources = [
    { source: 'Direct', percentage: 35, color: 'bg-blue-500' },
    { source: 'Search', percentage: 28, color: 'bg-green-500' },
    { source: 'Social Media', percentage: 20, color: 'bg-purple-500' },
    { source: 'Referral', percentage: 12, color: 'bg-orange-500' },
    { source: 'Other', percentage: 5, color: 'bg-gray-400' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance metrics and insights</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${metric.color} rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{metric.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Businesses */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Businesses by Views</h2>
          <div className="space-y-4">
            {topBusinesses.map((business, i) => (
              <div key={business.name} className="flex items-center space-x-4">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{business.name}</p>
                  <p className="text-xs text-gray-400">{business.views.toLocaleString()} views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">⭐ {business.rating}</p>
                  <p className="text-xs text-green-500">{business.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h2>
          <div className="space-y-3">
            {topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat.name}</span>
                  <span className="text-sm font-medium text-gray-900">{cat.businesses} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-3">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${source.color}`} />
                <span className="flex-1 text-sm text-gray-700">{source.source}</span>
                <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700">Mobile</span>
              </div>
              <span className="text-sm font-bold text-gray-900">68%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Desktop</span>
              </div>
              <span className="text-sm font-bold text-gray-900">28%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-700">Tablet</span>
              </div>
              <span className="text-sm font-bold text-gray-900">4%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '4%' }} />
            </div>
          </div>
        </div>

        {/* Growth Summary */}
        <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-xl p-6 text-white">
          <BarChart3 className="w-8 h-8 mb-4 text-white/80" />
          <h3 className="text-lg font-semibold mb-2">Monthly Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">User Growth</span>
              <span className="font-semibold">+18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Business Growth</span>
              <span className="font-semibold">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Revenue</span>
              <span className="font-semibold">+25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Engagement</span>
              <span className="font-semibold">+15%</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/60 text-xs">Data for February 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
