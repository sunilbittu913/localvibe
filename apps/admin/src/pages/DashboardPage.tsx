import React, { useEffect, useState } from 'react';
import { Users, Building2, FileText, Tag, TrendingUp, TrendingDown, ArrowUpRight, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { adminService } from '../services/adminService';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalPosts: 0,
    pendingApprovals: 0,
    totalOffers: 0,
    totalJobs: 0,
    newUsersToday: 0,
    newBusinessesToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.data) setStats(response.data);
    } catch (err) {
      // Use mock data if API not available
      setStats({
        totalUsers: 1250,
        totalBusinesses: 340,
        totalPosts: 890,
        pendingApprovals: 23,
        totalOffers: 156,
        totalJobs: 78,
        newUsersToday: 15,
        newBusinessesToday: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, change: '+12%', trend: 'up', color: 'bg-blue-500' },
    { label: 'Total Businesses', value: stats.totalBusinesses, icon: Building2, change: '+8%', trend: 'up', color: 'bg-green-500' },
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, change: '+15%', trend: 'up', color: 'bg-purple-500' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, change: '-5%', trend: 'down', color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { type: 'user', text: 'New user "Rahul Sharma" registered', time: '5 min ago', icon: Users, color: 'text-blue-500 bg-blue-50' },
    { type: 'business', text: '"Spice Garden" submitted for approval', time: '15 min ago', icon: Building2, color: 'text-green-500 bg-green-50' },
    { type: 'approval', text: '"TechHub Coworking" was approved', time: '1 hour ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { type: 'rejection', text: '"Quick Loans" was rejected (spam)', time: '2 hours ago', icon: XCircle, color: 'text-red-500 bg-red-50' },
    { type: 'offer', text: '"FitZone Gym" posted a new offer', time: '3 hours ago', icon: Tag, color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your platform's performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-primary-500 font-medium hover:text-primary-600">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active Offers</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalOffers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Open Jobs</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">New Users Today</span>
                <span className="text-sm font-semibold text-green-600">+{stats.newUsersToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">New Businesses Today</span>
                <span className="text-sm font-semibold text-green-600">+{stats.newBusinessesToday}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-xl p-6 text-white">
            <BarChart3 className="w-8 h-8 mb-3 text-white/80" />
            <h3 className="text-lg font-semibold mb-1">Platform Growth</h3>
            <p className="text-white/70 text-sm mb-4">Your platform is growing steadily with consistent user engagement.</p>
            <div className="flex items-center space-x-1 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>18% increase this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
