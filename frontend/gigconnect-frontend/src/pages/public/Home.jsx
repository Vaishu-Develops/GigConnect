import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AuroraBackground from '../../components/ui/AuroraBackground';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-8 items-center justify-center px-4 text-center z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-7xl font-bold text-white leading-tight"
          >
            Find Local Talent.
            <span className="block bg-gradient-to-r from-emerald-200 via-white to-emerald-200 bg-clip-text text-transparent">
              Grow Your Business.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-2xl text-emerald-50 max-w-3xl leading-relaxed font-light"
          >
            Connect with skilled freelancers in your community. Post gigs, find talent, and transform your projects with GigConnect.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
          >
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register?role=client"
                  className="group relative bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-emerald-200"
                >
                  <span className="relative z-10">I Need Services</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  to="/register?role=freelancer"
                  className="group relative border-2 border-white/80 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-emerald-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">I Offer Services</span>
                  <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="group relative bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-8 py-4 rounded-full font-bold text-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">Go to Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex items-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-emerald-200 text-sm">Active Freelancers</div>
            </div>
            <div className="w-px h-12 bg-emerald-300/30" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-emerald-200 text-sm">Projects Completed</div>
            </div>
            <div className="w-px h-12 bg-emerald-300/30" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-emerald-200 text-sm">Skill Categories</div>
            </div>
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-purple-50/50" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a thriving community of talented professionals and growing businesses
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Active Users", color: "emerald", delay: 0.1 },
              { number: "5,000+", label: "Completed Gigs", color: "purple", delay: 0.2 },
              { number: "4.8★", label: "Average Rating", color: "amber", delay: 0.3 },
              { number: "95%", label: "Success Rate", color: "cyan", delay: 0.4 }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: stat.delay }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to connect with local talent and transform your projects into reality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Sign up as a client or freelancer and build your profile with skills and portfolio.",
                gradient: "from-emerald-500 to-emerald-600",
                delay: 0.2
              },
              {
                step: "2", 
                title: "Find & Connect",
                description: "Browse gigs or freelancers, apply for work, and communicate directly through our platform.",
                gradient: "from-purple-500 to-purple-600",
                delay: 0.4
              },
              {
                step: "3",
                title: "Complete & Rate", 
                description: "Finish projects, make secure payments, and build your reputation with reviews.",
                gradient: "from-amber-500 to-amber-600",
                delay: 0.6
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: item.delay }}
                viewport={{ once: true }}
                className="text-center p-8 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-24 h-24 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400/20 rounded-full blur-lg" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users already connecting and growing together in the freelance revolution
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                to="/register?role=client"
                className="group relative bg-white text-emerald-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">Start Hiring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                to="/register?role=freelancer"
                className="group relative bg-transparent border-2 border-white/80 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-emerald-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">Start Earning</span>
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;