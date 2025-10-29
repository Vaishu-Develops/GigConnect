import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { paymentService } from '../../services/paymentService';
import { contractService } from '../../services/contractService';

const PaymentModal = ({ isOpen, onClose, gig, data, paymentType = 'gig', contract, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Support both old gig prop and new data prop for backward compatibility
  const item = data || gig;

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      let order;
      
      if (paymentType === 'contract') {
        // Create order for contract payment
        order = await paymentService.createOrder({
          contractId: contract._id,
          amount: contract.budget,
          type: 'contract'
        });
      } else {
        // Create order for gig payment
        order = await paymentService.createOrder({
          gigId: item._id,
          amount: item.budget,
          type: 'gig'
        });
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        // Check if Razorpay key is available
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
        console.log('Razorpay Key:', razorpayKey ? 'Present' : 'Missing');
        if (!razorpayKey) {
          setError('Payment configuration error. Please contact support.');
          setLoading(false);
          return;
        }

        const options = {
          key: razorpayKey,
          amount: order.order.amount,
          currency: order.order.currency,
          name: 'GigConnect',
          description: `Payment for: ${item.title}`,
          order_id: order.order.id,
          prefill: {
            name: item.client?.name,
            email: item.client?.email,
          },
          theme: {
            color: '#047857'
          },
          modal: {
            ondismiss: function() {
              setError('Payment cancelled by user');
              setLoading(false);
            }
          },
          handler: async function (response) {
            try {
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              if (paymentType === 'contract') {
                verifyData.contractId = contract._id;
                verifyData.type = 'contract';
              }

              await paymentService.verifyPayment(verifyData);
              
              // Payment successful - let the parent component handle the success
              onSuccess();
              onClose();
            } catch (error) {
              console.error('Payment verification error:', error);
              setError('Payment verification failed. Please contact support if money was debited.');
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      
      script.onerror = () => {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
      };
      
      document.body.appendChild(script);
    } catch (err) {
      setError('Failed to initialize payment');
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Payment"
      size="md"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{paymentType === 'contract' ? 'Contract:' : 'Gig:'}</span>
              <span className="font-medium">{item.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Freelancer:</span>
              <span className="font-medium">{item.freelancer?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{formatAmount(item.budget)}</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">Platform Fee (5%):</span>
              <span className="font-medium">{formatAmount(item.budget * 0.05)}</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-300 pt-2">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-emerald-600">
                {formatAmount(item.budget * 1.05)}
              </span>
            </div>
          </div>
        </div>

        {/* Test Payment Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">🧪 Test Mode Notice</h4>
          <p className="text-sm text-blue-800 mb-2">
            This is a test environment. Please use Razorpay test payment methods:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Test Card:</strong> 4111 1111 1111 1111, CVV: 123, Expiry: Any future date</li>
            <li>• <strong>Test UPI:</strong> Use "success@razorpay" for successful payment</li>
            <li>• <strong>Net Banking:</strong> Select any test bank and use "success" as password</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">
            ⚠️ Do not use real payment details in test mode
          </p>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="card" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
              <span>Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="upi" className="text-emerald-600 focus:ring-emerald-500" />
              <span>UPI</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="netbanking" className="text-emerald-600 focus:ring-emerald-500" />
              <span>Net Banking</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handlePayment}
            loading={loading}
            className="flex-1"
          >
            Pay Now
          </Button>
          
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          🔒 Your payment is secure and encrypted
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;