import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { paymentService } from '../../services/paymentService';

const PaymentModal = ({ isOpen, onClose, gig, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const order = await paymentService.createOrder({
        gigId: gig._id,
        amount: gig.budget
      });

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: order.order.amount,
          currency: order.order.currency,
          name: 'GigConnect',
          description: `Payment for: ${gig.title}`,
          order_id: order.order.id,
          handler: async function (response) {
            try {
              await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              
              onSuccess();
              onClose();
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: gig.client?.name,
            email: gig.client?.email,
          },
          theme: {
            color: '#047857'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
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
              <span className="text-gray-600">Gig:</span>
              <span className="font-medium">{gig.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Freelancer:</span>
              <span className="font-medium">{gig.freelancer?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{formatAmount(gig.budget)}</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">Platform Fee (5%):</span>
              <span className="font-medium">{formatAmount(gig.budget * 0.05)}</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-300 pt-2">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-emerald-600">
                {formatAmount(gig.budget * 1.05)}
              </span>
            </div>
          </div>
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