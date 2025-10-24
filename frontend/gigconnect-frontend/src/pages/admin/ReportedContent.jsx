import React, { useState, useEffect } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    // Mock data - in real app, this would come from an API
    setTimeout(() => {
      setReports([
        {
          id: 1,
          type: 'gig',
          title: 'Website Development Project',
          reason: 'Spam or misleading',
          reportedBy: 'John Doe',
          status: 'pending',
          createdAt: '2024-01-10'
        },
        {
          id: 2,
          type: 'user',
          title: 'Sarah Johnson',
          reason: 'Inappropriate behavior',
          reportedBy: 'Mike Smith',
          status: 'in-review',
          createdAt: '2024-01-09'
        },
        {
          id: 3,
          type: 'review',
          title: 'Project Review',
          reason: 'Harassment or hate speech',
          reportedBy: 'Alex Chen',
          status: 'resolved',
          createdAt: '2024-01-08'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const updateReportStatus = (reportId, status) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status } : report
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'accent',
      'in-review': 'warning',
      'resolved': 'success',
      'dismissed': 'gray'
    };
    return colors[status] || 'gray';
  };

  const getTypeColor = (type) => {
    const colors = {
      'gig': 'primary',
      'user': 'secondary',
      'review': 'accent'
    };
    return colors[type] || 'gray';
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' ? true : report.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reported Content</h1>
          <p className="text-gray-600 mt-2">
            Review and take action on reported content and user behavior
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: 'All Reports' },
              { key: 'pending', label: 'Pending' },
              { key: 'in-review', label: 'In Review' },
              { key: 'resolved', label: 'Resolved' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  filter === tab.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reports found
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'There are no reported items at the moment.'
                  : `No ${filter} reports found.`
                }
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Report Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {report.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Reported by: {report.reportedBy}</span>
                          <span>Reason: {report.reason}</span>
                          <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
                      <p className="text-gray-700 text-sm">
                        User reported this content for violating platform guidelines. 
                        Please review and take appropriate action.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 lg:w-48">
                    {report.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => updateReportStatus(report.id, 'in-review')}
                          className="w-full"
                        >
                          Start Review
                        </Button>
                        <Button
                          onClick={() => updateReportStatus(report.id, 'dismissed')}
                          variant="outline"
                          className="w-full"
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                    
                    {report.status === 'in-review' && (
                      <>
                        <Button
                          onClick={() => updateReportStatus(report.id, 'resolved')}
                          className="w-full"
                        >
                          Mark Resolved
                        </Button>
                        <Button
                          onClick={() => updateReportStatus(report.id, 'pending')}
                          variant="outline"
                          className="w-full"
                        >
                          Re-open
                        </Button>
                      </>
                    )}

                    <Button
                      variant="danger"
                      className="w-full"
                    >
                      Remove Content
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedContent;