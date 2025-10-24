import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { gigService } from '../../services/gigService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/helpers';
import { LoadingSpinner } from '../../components/ui/Loader';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    revenueData: [],
    gigCategories: [],
    platformStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // In a real app, this would be a dedicated analytics endpoint
      const [users, gigs, payments] = await Promise.all([
        userService.getUsers(),
        gigService.getGigs(),
        paymentService.getPaymentHistory()
      ]);

      // Mock analytics data calculation
      const userGrowth = calculateUserGrowth(users);
      const revenueData = calculateRevenueData(payments);
      const gigCategories = calculateGigCategories(gigs);
      const platformStats = calculatePlatformStats(users, gigs, payments);

      setAnalytics({
        userGrowth,
        revenueData,
        gigCategories,
        platformStats
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock calculation functions
  const calculateUserGrowth = (users) => {
    return [
      { month: 'Jan', users: 1000 },
      { month: 'Feb', users: 1500 },
      { month: 'Mar', users: 2200 },
      { month: 'Apr', users: 3000 },
      { month: 'May', users: 4000 },
      { month: 'Jun', users: 5200 }
    ];
  };

  const calculateRevenueData = (payments) => {
    return [
      { month: 'Jan', revenue: 50000 },
      { month: 'Feb', revenue: 75000 },
      { month: 'Mar', revenue: 120000 },
      { month: 'Apr', revenue: 180000 },
      { month: 'May', revenue: 250000 },
      { month: 'Jun', revenue: 320000 }
    ];
  };

  const calculateGigCategories = (gigs) => {
    const categories = {};
    gigs.forEach(gig => {
      categories[gig.category] = (categories[gig.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  };

  const calculatePlatformStats = (users, gigs, payments) => {
    const clients = users.filter(u => u.role === 'client').length;
    const freelancers = users.filter(u => u.role === 'freelancer').length;
    const completedGigs = gigs.filter(g => g.status === 'completed').length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const successRate = gigs.length > 0 ? (completedGigs / gigs.length) * 100 : 0;

    return {
      totalUsers: users.length,
      clients,
      freelancers,
      totalGigs: gigs.length,
      completedGigs,
      totalRevenue,
      successRate: Math.round(successRate)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into platform performance
            </p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              {analytics.platformStats.totalUsers?.toLocaleString()}
            </div>
            <div className="text-gray-600">Total Users</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.platformStats.clients} clients • {analytics.platformStats.freelancers} freelancers
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {analytics.platformStats.totalGigs?.toLocaleString()}
            </div>
            <div className="text-gray-600">Total Gigs</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.platformStats.completedGigs} completed
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-amber-600 mb-2">
              {formatCurrency(analytics.platformStats.totalRevenue)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
            <div className="text-sm text-gray-500 mt-1">
              Platform earnings
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {analytics.platformStats.successRate}%
            </div>
            <div className="text-gray-600">Success Rate</div>
            <div className="text-sm text-gray-500 mt-1">
              Project completion rate
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="space-y-3">
              {analytics.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-16">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                    <div
                      className="bg-emerald-500 h-4 rounded-full"
                      style={{
                        width: `${(data.users / Math.max(...analytics.userGrowth.map(d => d.users))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {data.users.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
            <div className="space-y-3">
              {analytics.revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-16">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{
                        width: `${(data.revenue / Math.max(...analytics.revenueData.map(d => d.revenue))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gig Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gig Categories</h3>
            <div className="space-y-3">
              {analytics.gigCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex-1">{category.name}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mx-4">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${(category.count / Math.max(...analytics.gigCategories.map(c => c.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">User Satisfaction</span>
                  <span className="font-medium text-gray-900">92%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">2.1s</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">System Uptime</span>
                  <span className="font-medium text-gray-900">99.9%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;