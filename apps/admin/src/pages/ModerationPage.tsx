import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Flag, MessageCircle, Eye, Search } from 'lucide-react';
import { adminService } from '../services/adminService';

interface Report {
  id: number;
  type: string;
  reason: string;
  description: string;
  status: string;
  reportedBy: string;
  targetName: string;
  targetType: string;
  createdAt: string;
}

const ModerationPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await adminService.getReports();
      setReports(response.data?.reports || response.data || []);
    } catch (err) {
      setReports([
        { id: 1, type: 'spam', reason: 'Spam content', description: 'This business listing contains spam and misleading information.', status: 'pending', reportedBy: 'Rahul Sharma', targetName: 'Quick Cash Loans', targetType: 'business', createdAt: '2025-02-18T10:00:00Z' },
        { id: 2, type: 'inappropriate', reason: 'Inappropriate content', description: 'The review contains offensive language.', status: 'pending', reportedBy: 'Priya Patel', targetName: 'Review #456', targetType: 'review', createdAt: '2025-02-17T10:00:00Z' },
        { id: 3, type: 'fake', reason: 'Fake business', description: 'This business does not exist at the listed address.', status: 'resolved', reportedBy: 'Amit Kumar', targetName: 'Phantom Services', targetType: 'business', createdAt: '2025-02-15T10:00:00Z' },
        { id: 4, type: 'scam', reason: 'Potential scam', description: 'This offer seems too good to be true and may be a scam.', status: 'dismissed', reportedBy: 'Sneha Reddy', targetName: 'Win iPhone Offer', targetType: 'offer', createdAt: '2025-02-14T10:00:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number, action: 'dismiss' | 'remove') => {
    try {
      await adminService.resolveReport(id, action);
    } catch {}
    setReports(reports.map((r) => r.id === id ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r));
  };

  const filteredReports = reports.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /><span>Resolved</span></span>;
      case 'dismissed': return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /><span>Dismissed</span></span>;
      default: return <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium"><AlertTriangle className="w-3 h-3" /><span>Pending</span></span>;
    }
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      spam: 'bg-orange-50 text-orange-700',
      inappropriate: 'bg-red-50 text-red-700',
      fake: 'bg-purple-50 text-purple-700',
      scam: 'bg-red-50 text-red-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[type] || 'bg-gray-100 text-gray-700'}`}>{type}</span>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">Review reported content and take action</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
            {reports.filter((r) => r.status === 'pending').length} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'pending', 'resolved', 'dismissed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              statusFilter === status ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <Flag className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{report.reason}</h3>
                      {typeBadge(report.type)}
                      {statusBadge(report.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Reported by: <span className="text-gray-600">{report.reportedBy}</span></span>
                      <span>Target: <span className="text-gray-600">{report.targetName}</span> ({report.targetType})</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleResolve(report.id, 'remove')}
                      className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Remove Content
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'dismiss')}
                      className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No reports found</h3>
          <p className="text-gray-400">All clear! No content reports to review.</p>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
