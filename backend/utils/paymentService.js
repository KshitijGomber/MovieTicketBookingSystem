/**
 * Dummy payment service for handling payments and refunds
 */

/**
 * Process a payment
 * @param {Object} paymentDetails - Payment details
 * @param {number} paymentDetails.amount - Amount to be paid
 * @param {string} paymentDetails.currency - Currency code (e.g., 'INR')
 * @param {string} paymentDetails.paymentMethod - Payment method ID or type
 * @returns {Promise<Object>} - Payment result
 */
const processPayment = async ({ amount, currency = 'INR', paymentMethod = 'card' }) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would integrate with a payment gateway like Stripe, Razorpay, etc.
  const paymentId = `pay_${Math.random().toString(36).substr(2, 10)}`;
  
  return {
    success: true,
    paymentId,
    amount,
    currency,
    status: 'succeeded',
    paymentMethod,
    receiptUrl: `https://example.com/receipts/${paymentId}`,
    timestamp: new Date().toISOString()
  };
};

/**
 * Process a refund
 * @param {Object} refundDetails - Refund details
 * @param {string} refundDetails.paymentId - Original payment ID
 * @param {number} refundDetails.amount - Amount to refund
 * @param {string} refundDetails.reason - Reason for refund
 * @returns {Promise<Object>} - Refund result
 */
const processRefund = async ({ paymentId, amount, reason = 'cancellation' }) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would integrate with a payment gateway
  const refundId = `re_${Math.random().toString(36).substr(2, 10)}`;
  
  return {
    success: true,
    refundId,
    paymentId,
    amount,
    status: 'succeeded',
    reason,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get payment details
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} - Payment details
 */
const getPaymentDetails = async (paymentId) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would fetch from your database or payment gateway
  return {
    id: paymentId,
    amount: 1000, // Example amount
    currency: 'INR',
    status: 'succeeded',
    paymentMethod: 'card',
    createdAt: new Date().toISOString(),
    receiptUrl: `https://example.com/receipts/${paymentId}`
  };
};

module.exports = {
  processPayment,
  processRefund,
  getPaymentDetails
};
