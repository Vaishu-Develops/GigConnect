import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import { LoadingSpinner } from '../ui/Loader';
import Button from '../ui/Button';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Award,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const AnalyticsDashboard = ({ workspaceId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [memberAnalytics, setMemberAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('overview'); // overview, members, timeline

  useEffect(() => {
    fetchAnalytics();
  }, [workspaceId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, memberData] = await Promise.all([
        analyticsService.getWorkspaceAnalytics(workspaceId),
        analyticsService.getMemberAnalytics(workspaceId)
      ]);
      
      setAnalytics(analyticsData.data);
      setMemberAnalytics(memberData.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "emerald" }) => (
    <div className={`bg-${color}-50 rounded-lg p-6 border border-${color}-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-700 text-sm font-medium mb-1`}>{title}</p>
          <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ value, max, color = "emerald" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analytics</h4>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchAnalytics}>Try Again</Button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Available</h4>
        <p className="text-gray-600">Start creating projects and discussions to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Workspace insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeView === 'members' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('members')}
          >
            Members
          </Button>
          <Button
            variant={activeView === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('timeline')}
          >
            Timeline
          </Button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={analytics.projectStats.total}
              icon={Target}
              color="blue"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics.productivityMetrics.completionRate}%`}
              icon={Award}
              color="emerald"
            />
            <StatCard
              title="Team Members"
              value={analytics.workspace.memberCount}
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Active Discussions"
              value={analytics.discussionStats.activeDiscussions}
              icon={MessageSquare}
              color="orange"
            />
          </div>

          {/* Project Status Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {analytics.projectStats.completed}
                </div>
                <div className="text-sm text-gray-600 mb-3">Completed</div>
                <ProgressBar 
                  value={analytics.projectStats.completed} 
                  max={analytics.projectStats.total}
                  color="emerald"
                />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.projectStats.inProgress}
                </div>
                <div className="text-sm text-gray-600 mb-3">In Progress</div>
                <ProgressBar 
                  value={analytics.projectStats.inProgress} 
                  max={analytics.projectStats.total}
                  color="blue"
                />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {analytics.projectStats.pending}
                </div>
                <div className="text-sm text-gray-600 mb-3">Pending</div>
                <ProgressBar 
                  value={analytics.projectStats.pending} 
                  max={analytics.projectStats.total}
                  color="yellow"
                />
              </div>
            </div>
          </div>

          {/* Productivity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Progress</span>
                  <span className="font-semibold text-gray-900">{analytics.projectStats.avgProgress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects This Month</span>
                  <span className="font-semibold text-gray-900">{analytics.productivityMetrics.projectsThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Completion Time</span>
                  <span className="font-semibold text-gray-900">
                    {analytics.productivityMetrics.avgTimeToComplete} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Engagement</span>
                  <span className="font-semibold text-gray-900">
                    {analytics.productivityMetrics.memberEngagement}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Discussions</span>
                  <span className="font-semibold text-gray-900">{analytics.discussionStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Messages</span>
                  <span className="font-semibold text-gray-900">{analytics.discussionStats.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Discussions</span>
                  <span className="font-semibold text-gray-900">{analytics.discussionStats.activeDiscussions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Messages per Discussion</span>
                  <span className="font-semibold text-gray-900">
                    {analytics.discussionStats.total > 0 
                      ? Math.round(analytics.discussionStats.totalMessages / analytics.discussionStats.total)
                      : 0
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeView === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
              <p className="text-sm text-gray-600 mt-1">Individual member contributions and activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {memberAnalytics.map((member, index) => (
                  <div key={member.user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-emerald-600 font-semibold">
                        #{index + 1}
                      </div>
                      <img
                        src={member.user.avatar || '/default-avatar.png'}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.user.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{member.projects.total}</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-600">{member.projects.completed}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{member.discussions.participated}</div>
                        <div className="text-xs text-gray-600">Discussions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{member.productivity.engagementScore}</div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeView === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline (Last 30 Days)</h3>
            {analytics.timelineData.length > 0 ? (
              <div className="space-y-4">
                {analytics.timelineData.map((day, index) => (
                  <div key={day._id} className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-gray-600">{day._id}</div>
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Created: {day.projectsCreated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">Completed: {day.projectsCompleted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No activity data available for the last 30 days</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Analytics generated on {new Date(analytics.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;