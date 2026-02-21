import React, { useEffect, useState } from 'react';
import { Users, Search, MoreVertical, Shield, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';
import { adminService } from '../services/adminService';

interface UserItem {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data?.users || response.data || []);
    } catch (err) {
      setUsers([
        { id: 1, uuid: '1', firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', role: 'normal_user', isActive: true, isVerified: true, createdAt: '2025-01-15T10:00:00Z' },
        { id: 2, uuid: '2', firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', phone: '+91 87654 32109', role: 'business_user', isActive: true, isVerified: true, createdAt: '2025-01-20T10:00:00Z' },
        { id: 3, uuid: '3', firstName: 'Amit', lastName: 'Kumar', email: 'amit@example.com', phone: null, role: 'normal_user', isActive: false, isVerified: false, createdAt: '2025-02-01T10:00:00Z' },
        { id: 4, uuid: '4', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@example.com', phone: '+91 76543 21098', role: 'business_user', isActive: true, isVerified: true, createdAt: '2025-02-05T10:00:00Z' },
        { id: 5, uuid: '5', firstName: 'Admin', lastName: 'User', email: 'admin@localvibe.in', phone: null, role: 'admin', isActive: true, isVerified: true, createdAt: '2025-01-01T10:00:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await adminService.toggleUserStatus(id);
    } catch {}
    setUsers(users.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-50 text-red-700',
      business_user: 'bg-blue-50 text-blue-700',
      normal_user: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      admin: 'Admin',
      business_user: 'Business',
      normal_user: 'User',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[role] || colors.normal_user}`}>{labels[role] || role}</span>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all platform users</p>
        </div>
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">{filteredUsers.length} users</span>
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
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
            />
          </div>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'normal_user', label: 'Users' },
              { value: 'business_user', label: 'Business' },
              { value: 'admin', label: 'Admin' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRoleFilter(opt.value)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === opt.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary-600">{user.firstName[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          {user.isVerified && (
                            <span className="text-xs text-green-500">Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              user.isActive
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-400">No users match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
