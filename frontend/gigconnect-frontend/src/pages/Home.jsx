import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Shield, Star, MessageCircle, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Local Talent',
      description: 'Find freelancers in your city'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All freelancers are verified'
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Choose based on reviews'
    },
    {
      icon: MessageCircle,
      title: 'Direct Chat',
      description: 'Communicate instantly'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#1A1F3A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find <span className="gradient-text">Local Talent</span>
              <br />
              Near You
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with skilled professionals in your area. From web development to graphic design.
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search skills or services..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register?role=client"
                    className="bg-gradient-to-r from-secondary to-accent text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    I Need Services
                  </Link>
                  <Link
                    to="/register?role=freelancer"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all"
                  >
                    I Offer Services
                  </Link>
                </>
              ) : (
                <Link
                  to="/gigs"
                  className="bg-gradient-to-r from-secondary to-accent text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center"
                >
                  Browse Gigs <ArrowRight className="ml-2" size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GigConnect?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;