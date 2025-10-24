import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const PaymentSuccess = ({ order, gig }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
            ✓
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your payment. Your project is now confirmed and the freelancer has been notified.
        </p>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.orderId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Gig:</span>
              <span className="font-medium">{gig.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-emerald-600">
                {formatAmount(order.amount)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <Button as={Link} to={`/messages/new?gigId=${gig._id}`} className="w-full">
            Message Freelancer
          </Button>
          
          <Button as={Link} to="/client/active-projects" variant="secondary" className="w-full">
            View Active Projects
          </Button>
          
          <Button as={Link} to="/dashboard" variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help? <a href="/contact" className="text-emerald-600 hover:text-emerald-700">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;