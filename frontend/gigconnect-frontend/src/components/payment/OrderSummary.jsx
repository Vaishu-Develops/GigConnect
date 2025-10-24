import React from 'react';

const OrderSummary = ({ gig, showFee = true }) => {
  const platformFee = gig.budget * 0.05;
  const totalAmount = gig.budget + platformFee;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Gig Amount:</span>
          <span className="font-medium">{formatAmount(gig.budget)}</span>
        </div>
        
        {showFee && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee (5%):</span>
            <span className="font-medium">{formatAmount(platformFee)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-emerald-600">
              {formatAmount(showFee ? totalAmount : gig.budget)}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="text-emerald-600 mr-2">✓</span>
          Secure payment processing
        </div>
        <div className="flex items-center">
          <span className="text-emerald-600 mr-2">✓</span>
          Money-back guarantee
        </div>
        <div className="flex items-center">
          <span className="text-emerald-600 mr-2">✓</span>
          24/7 customer support
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;