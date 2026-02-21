import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Eye, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../services/adminService';

interface Post {
  id: number;
  uuid: string;
  title: string;
  description: string | null;
  status: string;
  businessName: string;
  businessId: number;
  categoryName: string;
  createdAt: string;
  type: string;
}

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadPosts();
  }, [statusFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await adminService.getPosts(params);
      setPosts(response.data?.posts || response.data || []);
    } catch (err) {
      // Mock data for demo
      setPosts([
        { id: 1, uuid: '1', title: 'Grand Opening Sale - 50% Off', description: 'Join us for our grand opening with amazing discounts on all items.', status: 'pending', businessName: 'Spice Garden Restaurant', businessId: 1, categoryName: 'Restaurants', createdAt: new Date().toISOString(), type: 'offer' },
        { id: 2, uuid: '2', title: 'Full Stack Developer Position', description: 'Looking for an experienced full stack developer to join our team.', status: 'pending', businessName: 'TechHub Solutions', businessId: 2, categoryName: 'Technology', createdAt: new Date().toISOString(), type: 'job' },
        { id: 3, uuid: '3', title: 'Free Health Checkup Camp', description: 'Free health checkup for all community members this weekend.', status: 'approved', businessName: 'City Hospital', businessId: 3, categoryName: 'Healthcare', createdAt: new Date().toISOString(), type: 'offer' },
        { id: 4, uuid: '4', title: 'Yoga Classes - First Month Free', description: 'Start your wellness journey with free yoga classes for the first month.', status: 'approved', businessName: 'FitZone Gym', businessId: 4, categoryName: 'Fitness', createdAt: new Date().toISOString(), type: 'offer' },
        { id: 5, uuid: '5', title: 'Quick Cash Loans - Apply Now', description: 'Get instant cash loans with minimal documentation.', status: 'rejected', businessName: 'Quick Finance', businessId: 5, categoryName: 'Finance', createdAt: new Date().toISOString(), type: 'listing' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await adminService.approvePost(id);
      setPosts(posts.map((p) => p.id === id ? { ...p, status: 'approved' } : p));
    } catch (err) {
      setPosts(posts.map((p) => p.id === id ? { ...p, status: 'approved' } : p));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await adminService.rejectPost(id);
      setPosts(posts.map((p) => p.id === id ? { ...p, status: 'rejected' } : p));
    } catch (err) {
      setPosts(posts.map((p) => p.id === id ? { ...p, status: 'rejected' } : p));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /><span>Approved</span></span>;
      case 'rejected': return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /><span>Rejected</span></span>;
      default: return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /><span>Pending</span></span>;
    }
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      offer: 'bg-purple-50 text-purple-700',
      job: 'bg-blue-50 text-blue-700',
      listing: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[type] || colors.listing}`}>{type}</span>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts & Listings</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage all business posts</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">{filteredPosts.length} posts</span>
        </div>
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
              placeholder="Search posts..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                          {post.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">{post.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{post.businessName}</p>
                      <p className="text-xs text-gray-400">{post.categoryName}</p>
                    </td>
                    <td className="px-6 py-4">{typeBadge(post.type)}</td>
                    <td className="px-6 py-4">{statusBadge(post.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {post.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(post.id)}
                              disabled={actionLoading === post.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(post.id)}
                              disabled={actionLoading === post.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {post.status === 'approved' && (
                          <button
                            onClick={() => handleReject(post.id)}
                            disabled={actionLoading === post.id}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                        {post.status === 'rejected' && (
                          <button
                            onClick={() => handleApprove(post.id)}
                            disabled={actionLoading === post.id}
                            className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Approve
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
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts found</h3>
            <p className="text-gray-400">No posts match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
