import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, Building2, Calendar, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchJobs } from '../store/slices/businessSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const experienceLabels: Record<string, string> = {
  fresher: 'Fresher',
  junior: 'Junior',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
};

const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.business);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = !searchQuery || job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    return matchesSearch && matchesType;
  });

  const formatSalary = (min: string | null, max: string | null, currency: string) => {
    if (!min && !max) return null;
    const fmt = (v: string) => `${currency} ${Number(v).toLocaleString('en-IN')}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Next Opportunity</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Discover job openings from local businesses in your area
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-full shadow-xl overflow-hidden p-1.5">
              <div className="flex-1 flex items-center pl-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, skill, or keyword..."
                  className="w-full py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setJobTypeFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!jobTypeFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All Types
              </button>
              {Object.entries(jobTypeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setJobTypeFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${jobTypeFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">{filteredJobs.length} jobs found</p>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job: any) => (
              <div key={job.id || job.uuid} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-primary-200 transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          {job.business?.name && (
                            <span className="flex items-center space-x-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{job.business.name}</span>
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{job.location}</span>
                            </span>
                          )}
                          {job.jobType && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                              {jobTypeLabels[job.jobType] || job.jobType}
                            </span>
                          )}
                          {job.experienceLevel && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                              {experienceLabels[job.experienceLevel] || job.experienceLevel}
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">Remote</span>
                          )}
                        </div>
                        {job.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
                        )}
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency || 'INR') && (
                          <div className="flex items-center space-x-1.5 text-sm font-medium text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency || 'INR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                    {job.createdAt && (
                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-6">Check back later for new opportunities</p>
            <Link to="/discover" className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600">
              <span>Browse Businesses</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
