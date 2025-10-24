import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: "For Clients",
      questions: [
        {
          question: "How do I post a gig?",
          answer: "Simply sign up as a client, click 'Post a Gig' from your dashboard, fill in the project details, budget, and required skills. Your gig will be visible to freelancers immediately."
        },
        {
          question: "How much does it cost to use GigConnect?",
          answer: "Posting gigs is completely free. We charge a 5% platform fee only when you make a payment to a freelancer through our secure payment system."
        },
        {
          question: "How do I choose the right freelancer?",
          answer: "Review freelancer profiles, portfolios, ratings, and reviews. You can also message candidates to discuss your project before making a decision."
        },
        {
          question: "Is my payment secure?",
          answer: "Yes! We use Razorpay for secure payment processing. Funds are held securely and released to freelancers only when you approve the work."
        }
      ]
    },
    {
      title: "For Freelancers",
      questions: [
        {
          question: "How do I apply for gigs?",
          answer: "Browse available gigs, click 'Apply Now' on gigs that match your skills, and submit your proposal including your bid, timeline, and why you're the right fit."
        },
        {
          question: "How do I get paid?",
          answer: "Once a client approves your work, they release payment through our platform. You can withdraw funds to your bank account or UPI."
        },
        {
          question: "Can I work with multiple clients?",
          answer: "Yes! You can apply for and work on multiple gigs simultaneously as long as you can manage the workload and meet deadlines."
        },
        {
          question: "How do reviews work?",
          answer: "After project completion, clients can leave reviews and ratings. These help build your reputation and attract more clients."
        }
      ]
    },
    {
      title: "General Questions",
      questions: [
        {
          question: "Is GigConnect available in my city?",
          answer: "GigConnect operates across India. We focus on connecting local talent, so you'll see gigs and freelancers in your area."
        },
        {
          question: "What if I have a dispute with a client/freelancer?",
          answer: "We have a dispute resolution process. Contact our support team, and we'll help mediate and find a fair solution."
        },
        {
          question: "Can I change my role from client to freelancer?",
          answer: "Yes, you can update your profile settings to switch between client and freelancer roles at any time."
        },
        {
          question: "How do I contact customer support?",
          answer: "Use the contact form on our Contact page, or email us at support@gigconnect.com. We typically respond within 24 hours."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-emerald-100">
            Find answers to common questions about using GigConnect
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, itemIndex) => {
                  const fullIndex = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems[fullIndex];
                  
                  return (
                    <div key={itemIndex} className="px-6 py-4">
                      <button
                        onClick={() => toggleItem(fullIndex)}
                        className="flex justify-between items-center w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        <span className="flex-shrink-0 text-gray-400 text-xl">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="mt-3 text-gray-600 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help you get the most out of GigConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@gigconnect.com"
              className="bg-white text-emerald-600 border border-emerald-200 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-all duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;