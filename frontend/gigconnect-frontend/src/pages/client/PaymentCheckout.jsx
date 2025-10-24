import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import PaymentModal from '../../components/payment/PaymentModal';
import OrderSummary from '../../components/payment/OrderSummary';
import { LoadingSpinner } from '../../components/ui/Loader';

const PaymentCheckout = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (error) {
      console.error('Failed to fetch gig:', error);
      navigate('/client/my-gigs');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate(`/client/payment-success/${gigId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gig not found
          </h3>
          <p className="text-gray-600">
            The gig you're trying to pay for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            Secure payment for your project with {gig.freelancer?.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Project Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-2xl">
                    💼
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{gig.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{gig.description}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl">
                    👨‍💼
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Freelancer</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <img
                        src={gig.freelancer?.avatar || '/default-avatar.png'}
                        alt={gig.freelancer?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{gig.freelancer?.name}</p>
                        <p className="text-gray-600 text-sm">⭐ {gig.freelancer?.avgRating || 'No ratings'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 border-emerald-500 rounded-lg bg-emerald-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    defaultChecked
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Razorpay</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                  </div>
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    🔒
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            <OrderSummary gig={gig} showFee={true} />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                Pay Now
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                🔒 Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        gig={gig}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PaymentCheckout;