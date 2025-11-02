// pages/common/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChartBarIcon, 
  BriefcaseIcon, 
  CurrencyRupeeIcon, 
  StarIcon,
  PlusIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  UsersIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 relative">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                      {getGreeting()}, {user.name}!
                    </h1>
                    <p className="text-emerald-600/80 mt-1 font-medium">
                      {user.role === 'client' ? 'Client Dashboard' : 'Freelancer Dashboard'}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 max-w-lg">
                  Here's what's happening with your {user.role === 'client' ? 'projects' : 'work'} today.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">Current Time</div>
                <div className="text-lg font-semibold text-slate-700">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-slate-500">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {user.role === 'client' ? (
          <ClientDashboard />
        ) : (
          <FreelancerDashboard />
        )}
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  const statsCards = [
    {
      title: 'Active Projects',
      value: '12',
      subtitle: 'Projects in progress',
      icon: BriefcaseIcon,
      color: 'emerald',
      trend: { value: '+2', direction: 'up' }
    },
    {
      title: 'Total Spent',
      value: '₹1,24,500',
      subtitle: 'Across all projects',
      icon: CurrencyRupeeIcon,
      color: 'purple',
      trend: { value: '+8%', direction: 'up' }
    },
    {
      title: 'Pending Reviews',
      value: '3',
      subtitle: 'Projects to review',
      icon: StarIcon,
      color: 'amber',
      trend: { value: '-1', direction: 'down' }
    },
    {
      title: 'Completed Projects',
      value: '47',
      subtitle: 'Successfully finished',
      icon: CheckCircleIcon,
      color: 'green',
      trend: { value: '+5', direction: 'up' }
    }
  ];

  const quickActions = [
    {
      title: 'Post New Gig',
      icon: PlusIcon,
      link: '/client/post-gig',
      color: 'emerald',
      description: 'Create a new project'
    },
    {
      title: 'My Gigs',
      icon: DocumentTextIcon,
      link: '/client/my-gigs',
      color: 'purple',
      description: 'Manage your gigs'
    },
    {
      title: 'My Contracts',
      icon: BriefcaseIcon,
      link: '/client/contracts',
      color: 'blue',
      description: 'View all contracts'
    },
    {
      title: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      link: '/messages',
      color: 'cyan',
      description: 'Chat with freelancers'
    },
    {
      title: 'Active Projects',
      icon: ClockIcon,
      link: '/client/active-projects',
      color: 'orange',
      description: 'Monitor progress'
    },
    {
      title: 'Workspaces',
      icon: UsersIcon,
      link: '/workspaces',
      color: 'indigo',
      description: 'Team collaboration'
    }
  ];

  const getColorClasses = (color) => ({
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 border-emerald-200',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50 border-amber-200',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50 border-green-200',
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200',
    cyan: 'from-cyan-500 to-cyan-600 text-cyan-600 bg-cyan-50 border-cyan-200',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 border-orange-200',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 border-indigo-200'
  }[color]);

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          const IconComponent = stat.icon;
          
          return (
            <div key={index} className="group relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses.split(' ')[2]} ${colorClasses.split(' ')[3]}`}>
                    <IconComponent className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend.direction === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend.direction === 'up' ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {stat.trend.value}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-sm text-slate-500">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const colorClasses = getColorClasses(action.color);
            const IconComponent = action.icon;
            
            return (
              <Link
                key={index}
                to={action.link}
                className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FreelancerDashboard = () => {
  const statsCards = [
    {
      title: 'Active Jobs',
      value: '5',
      subtitle: 'Jobs in progress',
      icon: BriefcaseIcon,
      color: 'emerald',
      trend: { value: '+1', direction: 'up' }
    },
    {
      title: 'Total Earnings',
      value: '₹85,200',
      subtitle: 'This month',
      icon: BanknotesIcon,
      color: 'purple',
      trend: { value: '+12%', direction: 'up' }
    },
    {
      title: 'Rating',
      value: '4.8',
      subtitle: 'Based on 47 reviews',
      icon: StarIcon,
      color: 'amber',
      trend: { value: '+0.2', direction: 'up' }
    },
    {
      title: 'Completed Jobs',
      value: '38',
      subtitle: 'Successfully finished',
      icon: TrophyIcon,
      color: 'green',
      trend: { value: '+3', direction: 'up' }
    }
  ];

  const quickActions = [
    {
      title: 'Browse Jobs',
      icon: EyeIcon,
      link: '/freelancer/browse-jobs',
      color: 'emerald',
      description: 'Find new opportunities'
    },
    {
      title: 'My Applications',
      icon: DocumentTextIcon,
      link: '/freelancer/applications',
      color: 'purple',
      description: 'Track your proposals'
    },
    {
      title: 'Hire Proposals',
      icon: BriefcaseIcon,
      link: '/freelancer/hire-proposals',
      color: 'blue',
      description: 'Direct hire requests'
    },
    {
      title: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      link: '/messages',
      color: 'cyan',
      description: 'Chat with clients'
    },
    {
      title: 'Earnings',
      icon: CurrencyRupeeIcon,
      link: '/freelancer/earnings',
      color: 'orange',
      description: 'View your income'
    },
    {
      title: 'Workspaces',
      icon: UsersIcon,
      link: '/workspaces',
      color: 'indigo',
      description: 'Team collaboration'
    }
  ];

  const getColorClasses = (color) => ({
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 border-emerald-200',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50 border-amber-200',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50 border-green-200',
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200',
    cyan: 'from-cyan-500 to-cyan-600 text-cyan-600 bg-cyan-50 border-cyan-200',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 border-orange-200',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 border-indigo-200'
  }[color]);

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          const IconComponent = stat.icon;
          
          return (
            <div key={index} className="group relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses.split(' ')[2]} ${colorClasses.split(' ')[3]}`}>
                    <IconComponent className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend.direction === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend.direction === 'up' ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {stat.trend.value}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-sm text-slate-500">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const colorClasses = getColorClasses(action.color);
            const IconComponent = action.icon;
            
            return (
              <Link
                key={index}
                to={action.link}
                className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;