import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import { generateTestPaymentData, verifyPaymentSignature } from './paymentGateway.js';

// Test payment utility functions
const testPaymentUtils = () => {
  console.log('=== Testing Payment Gateway Utilities ===');
  
  // Test data generation
  const testData = generateTestPaymentData();
  console.log('Test Payment Data:', testData);
  
  // Test signature verification (should be false for test data)
  const isValid = verifyPaymentSignature(
    testData.order_id,
    testData.payment_id, 
    testData.signature
  );
  console.log('Signature Valid:', isValid);
  
  console.log('=== Test Complete ===');
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPaymentUtils();
}

export default testPaymentUtils;