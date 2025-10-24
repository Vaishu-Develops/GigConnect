import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { gigService } from '../../services/gigService';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loader';

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [payment, setPayment] = useState(null);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentDetails();
  }, [orderId]);

  const fetchPaymentDetails = async () => {
    try {
      const paymentData = await paymentService.getPayment(orderId);
      setPayment(paymentData.payment);
      
      // Fetch gig details
      if (paymentData.payment.gigId) {
        const gigData = await gigService.getGigById(paymentData.payment.gigId);
        setGig(gigData);
      }
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment not found
          </h3>
          <p className="text-gray-600">
            We couldn't find the payment details you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          {/* Success Animation */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Received!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Great news! A client has made a payment for your work. The funds will be available in your account after processing.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-emerald-600">
                  {formatAmount(payment.amount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{payment.orderId}</span>
              </div>
              
              {gig && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Project:</span>
                  <span className="font-medium">{gig.title}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-emerald-600 capitalize">
                  {payment.status}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <Button as={Link} to="/freelancer/active-jobs" className="w-full">
              Go to Active Jobs
            </Button>
            
            <Button as={Link} to="/freelancer/earnings" variant="secondary" className="w-full">
              View Earnings
            </Button>
            
            {gig && (
              <Button 
                as={Link} 
                to={`/messages/new?userId=${gig.client?._id}&gigId=${gig._id}`}
                variant="outline" 
                className="w-full"
              >
                Thank Client
              </Button>
            )}
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Funds will be available in 2-3 business days
            </p>
            <p className="text-xs text-gray-400">
              Need help? <a href="/contact" className="text-emerald-600 hover:text-emerald-700">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;