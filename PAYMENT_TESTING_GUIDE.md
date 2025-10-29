# Payment Testing Guide for GigConnect

## Overview
This guide explains how to properly test the payment functionality in GigConnect using Razorpay test mode.

## Important: Test Mode vs Live Mode

### ❌ What NOT to do in Test Mode:
- Do not use real UPI IDs (like your actual Google Pay, PhonePe, etc.)
- Do not use real bank account details
- Do not use real credit/debit card numbers
- Do not expect real money to be transferred

### ✅ What TO do in Test Mode:
- Use Razorpay's test payment methods
- Follow the test credentials provided below

## Test Payment Methods

### 1. Test Credit/Debit Cards
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

### 2. Test UPI
```
UPI ID: success@razorpay  (for successful payments)
UPI ID: failure@razorpay  (for failed payments)
```

### 3. Test Net Banking
```
Select any bank from the test list
Username: razorpay
Password: success (for successful payment)
Password: failure (for failed payment)
```

### 4. Test Wallets
```
Select any wallet
Phone: 9999999999
OTP: 123456
```

## Testing the Contract Payment Flow

### Step 1: Create and Complete a Contract
1. Login as a client
2. Create a direct hire contract with a freelancer
3. Have the freelancer accept the contract
4. Mark the contract as completed

### Step 2: Initiate Payment
1. Go to the contract details page
2. Click "Send Payment" button
3. You should be redirected to the payment checkout page

### Step 3: Process Test Payment
1. Click "Pay Now" button
2. Razorpay checkout will open
3. Select any payment method
4. Use the test credentials above
5. Complete the payment

### Step 4: Verify Success
1. Payment should be successful
2. You should be redirected back to contracts page
3. Contract payment status should show as "Paid"
4. Freelancer should see payment notification

## Common Issues and Solutions

### Issue: "PSP is not registered"
**Cause**: Using real payment methods in test mode
**Solution**: Use only Razorpay test payment methods listed above

### Issue: Payment verification failed
**Cause**: Backend not running or network issues
**Solution**: 
1. Ensure backend server is running on port 5000
2. Check browser console for errors
3. Verify environment variables are set correctly

### Issue: Authentication key missing
**Cause**: Frontend environment variable not set
**Solution**: 
1. Ensure `VITE_RAZORPAY_KEY` is set in frontend/.env
2. Restart the frontend development server

### Issue: Amount debited but payment not recognized
**Cause**: Using real payment methods instead of test methods
**Solution**: 
1. Always use test payment methods in test mode
2. Real payments will be debited and credited back automatically
3. The system won't recognize real payments in test mode

## Environment Variables Check

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_RUsdIYsrZ2x7c1
```

### Backend (.env)
```
RAZORPAY_KEY_ID=rzp_test_RUsdIYsrZ2x7c1
RAZORPAY_KEY_SECRET=grP4sNPNj34wa5amrCDuoY3A
```

## Troubleshooting Steps

1. **Clear browser cache** if payments are not working
2. **Check browser console** for JavaScript errors
3. **Verify both servers are running**:
   - Frontend: http://localhost:5174
   - Backend: http://localhost:5000
4. **Test with different browsers** if issues persist
5. **Check network tab** to see if API calls are successful

## Success Indicators

### ✅ Payment Successful:
- Razorpay shows "Payment Successful" message
- Redirected to contracts page with success message
- Contract shows "Payment Status: Paid"
- No errors in browser console

### ❌ Payment Failed:
- Razorpay shows error message
- No redirect occurs
- Contract payment status remains "Unpaid"
- Error messages displayed to user

## Contact Support

If you encounter issues not covered in this guide:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure you're using test payment methods
4. Contact the development team with specific error messages

---
**Remember**: Always use test payment methods in development. Real payment details will not work and may cause confusion.