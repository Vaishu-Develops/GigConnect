import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useGig } from '../context/GigContext';
import { 
  Briefcase, 
  Users, 
  IndianRupee, 
  TrendingUp,
  Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const { gigs } = useGig();

  const userGigs = gigs.filter(gig => 
    user?.role === 'client' ? gig.client === user._id : true
  );

  const stats = [
    {
      label: 'Total Gigs',
      value: userGigs.length,
      icon: Briefcase,
      color: 'from-secondary to-accent'
    },
    {
      label: 'Active Gigs',
      value: userGigs.filter(g => g.status === 'open').length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Earnings',
      value: '₹0', // You can calculate this from payments
      icon: IndianRupee,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      label: 'Messages',
      value: '0',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your gigs today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} hover>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Gigs */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Gigs
                </h2>
                {user?.role === 'client' && (
                  <Link
                    to="/post-gig"
                    className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Post New Gig
                  </Link>
                )}
              </div>

              {userGigs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No gigs found</p>
                  {user?.role === 'client' ? (
                    <Link
                      to="/post-gig"
                      className="text-secondary hover:text-blue-600 font-medium"
                    >
                      Post your first gig
                    </Link>
                  ) : (
                    <Link
                      to="/gigs"
                      className="text-secondary hover:text-blue-600 font-medium"
                    >
                      Browse available gigs
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {userGigs.slice(0, 5).map((gig) => (
                    <div
                      key={gig._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {gig.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Budget: ₹{gig.budget}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gig.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gig.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Links */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/gigs"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="mr-3 text-secondary" size={20} />
                  <span>Browse All Gigs</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="mr-3 text-accent" size={20} />
                  <span>Edit Profile</span>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrendingUp className="mr-3 text-green-500" size={20} />
                  <span>View Messages</span>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;