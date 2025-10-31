import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gigService } from '../../services/gigService';
import { contractService } from '../../services/contractService';
import PaymentModal from '../../components/payment/PaymentModal';
import OrderSummary from '../../components/payment/OrderSummary';
import { LoadingSpinner } from '../../components/ui/Loader';

const PaymentCheckout = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [gig, setGig] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState('gig'); // 'gig' or 'contract'

  useEffect(() => {
    // Check if we're paying for a contract (from state) or a gig (from URL)
    if (location.state?.contract) {
      setPaymentType('contract');
      setContract(location.state.contract);
      setLoading(false);
    } else if (gigId) {
      setPaymentType('gig');
      fetchGig();
    } else {
      navigate('/client/dashboard');
    }
  }, [gigId, location.state]);

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

  const handlePaymentSuccess = async () => {
    if (paymentType === 'contract') {
      console.log('Contract payment successful, setting up refresh triggers...');
      
      // Set a flag that contract was paid - ContractDetails will listen for this
      localStorage.setItem('contractPaymentSuccess', contract._id);
      
      // Trigger a custom event for any listening components
      window.dispatchEvent(new CustomEvent('contractPaymentSuccess', {
        detail: { contractId: contract._id }
      }));
      
      // Redirect to contracts page with success message
      navigate('/contracts', { 
        state: { 
          message: 'Payment sent successfully! The freelancer will be notified.',
          refreshData: true
        }
      });
    } else {
      navigate(`/client/payment-success/${gigId}`);
    }
  };

  // Get the data object for display (gig or contract)
  const getData = () => {
    if (paymentType === 'contract') {
      return {
        title: contract.title,
        description: contract.description,
        budget: contract.budget,
        freelancer: contract.freelancer,
        client: contract.client
      };
    }
    return gig;
  };

  const data = getData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paymentType === 'contract' ? 'Contract not found' : 'Gig not found'}
          </h3>
          <p className="text-gray-600">
            {paymentType === 'contract' 
              ? "The contract you're trying to pay for doesn't exist."
              : "The gig you're trying to pay for doesn't exist."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Test Mode Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-yellow-600 text-lg mr-2">🧪</div>
            <div>
              <h4 className="font-semibold text-yellow-800">Test Mode Active</h4>
              <p className="text-sm text-yellow-700">
                Use Razorpay test payment methods only. Do not use real payment details.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            Secure payment for your {paymentType === 'contract' ? 'contract' : 'project'} with {data.freelancer?.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {paymentType === 'contract' ? 'Contract Details' : 'Project Details'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-2xl">
                    💼
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{data.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{data.description}</p>
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
                        src={data.freelancer?.avatar || '/robot.png'}
                        alt={data.freelancer?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{data.freelancer?.name}</p>
                        <p className="text-gray-600 text-sm">⭐ {data.freelancer?.avgRating || 'No ratings'}</p>
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
            <OrderSummary data={data} showFee={true} />
            
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
        data={data}
        paymentType={paymentType}
        contract={contract}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PaymentCheckout;