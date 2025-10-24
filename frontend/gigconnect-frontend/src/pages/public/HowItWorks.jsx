import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up as a client or freelancer. Build your profile with skills, portfolio, and preferences.",
      client: "Post your project requirements and budget",
      freelancer: "Showcase your skills and set your rates",
      icon: "👤"
    },
    {
      number: 2,
      title: "Find & Connect",
      description: "Browse opportunities or talent in your area. Use filters to find perfect matches.",
      client: "Review freelancer profiles and portfolios",
      freelancer: "Apply to gigs that match your expertise",
      icon: "🔍"
    },
    {
      number: 3,
      title: "Communicate & Collaborate",
      description: "Use our built-in messaging system to discuss project details and requirements.",
      client: "Interview candidates and negotiate terms",
      freelancer: "Ask questions and clarify project scope",
      icon: "💬"
    },
    {
      number: 4,
      title: "Get Work Done",
      description: "Start working on the project with clear milestones and deliverables.",
      client: "Track progress and provide feedback",
      freelancer: "Deliver quality work on time",
      icon: "🚀"
    },
    {
      number: 5,
      title: "Pay & Review",
      description: "Make secure payments and leave reviews to build your reputation.",
      client: "Release payment upon satisfaction",
      freelancer: "Get paid and receive feedback",
      icon: "⭐"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How GigConnect Works
          </h1>
          <p className="text-xl text-emerald-100">
            Simple, transparent, and efficient - from finding talent to completing projects
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col lg:flex-row items-center gap-8">
              {/* Step Number & Icon */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <span className="text-3xl mr-3">{step.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">
                  {step.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-2">For Clients</h4>
                    <p className="text-emerald-700">{step.client}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">For Freelancers</h4>
                    <p className="text-purple-700">{step.freelancer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and start connecting today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=client"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              I Need Services
            </Link>
            <Link
              to="/register?role=freelancer"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              I Offer Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;