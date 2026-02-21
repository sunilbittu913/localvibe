import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Tag, Star, MessageCircle, Heart, Settings, Building2, ArrowRight, Bell } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppDispatch';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const quickActions = [
    { icon: MapPin, label: 'Discover', description: 'Find businesses near you', to: '/discover', color: 'bg-primary-50 text-primary-500' },
    { icon: Briefcase, label: 'Jobs', description: 'Browse job openings', to: '/jobs', color: 'bg-blue-50 text-blue-500' },
    { icon: Tag, label: 'Deals', description: 'View offers & deals', to: '/offers', color: 'bg-green-50 text-green-500' },
    { icon: Building2, label: 'My Business', description: 'Manage your business', to: '/discover', color: 'bg-purple-50 text-purple-500' },
  ];

  const recentActivity = [
    { icon: Star, text: 'You reviewed "Spice Garden Restaurant"', time: '2 hours ago', color: 'text-yellow-500' },
    { icon: Heart, text: 'You saved "TechHub Coworking Space"', time: '1 day ago', color: 'text-red-500' },
    { icon: MessageCircle, text: 'New message from "Green Leaf Cafe"', time: '2 days ago', color: 'text-blue-500' },
    { icon: Tag, text: 'New offer from "FitZone Gym"', time: '3 days ago', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-500 to-orange-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-white/80">Here's what's happening in your community</p>
            </div>
            <Link to="/profile" className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 transition-all group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">{action.label}</h3>
                    <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Reviews', value: '12', icon: Star, color: 'text-yellow-500' },
                  { label: 'Saved', value: '8', icon: Heart, color: 'text-red-500' },
                  { label: 'Messages', value: '5', icon: MessageCircle, color: 'text-blue-500' },
                  { label: 'Applications', value: '3', icon: Briefcase, color: 'text-green-500' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary-600">{user.firstName[0]?.toUpperCase()}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/profile" className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  <span>View Full Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'New offer near you!', time: '5m ago' },
                  { text: 'Your review was helpful', time: '1h ago' },
                  { text: 'Job match found', time: '3h ago' },
                ].map((notif, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Bell className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">{notif.text}</p>
                      <p className="text-xs text-gray-400">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
