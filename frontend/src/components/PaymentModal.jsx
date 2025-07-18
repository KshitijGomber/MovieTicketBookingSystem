import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton
} from '@mui/material';
import {
  CreditCard,
  Security,
  Close,
  CheckCircle,
  AccountBalance,
  Payment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ 
  open, 
  onClose, 
  onPaymentSuccess, 
  bookingDetails,
  isProcessing = false 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Details, 2: Processing, 3: Success

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;
    
    // Format card number
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) value = value.slice(0, 5);
    }
    
    // Format CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setStep(2); // Processing step
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment success
      const paymentResult = {
        success: true,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount: bookingDetails?.totalAmount || 0,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        cardLast4: paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null
      };
      
      setStep(3); // Success step
      
      // Wait a moment to show success, then call parent callback
      setTimeout(() => {
        onPaymentSuccess(paymentResult);
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      setStep(1); // Back to form
      setErrors({ submit: 'Payment failed. Please try again.' });
    }
  };

  const handleClose = () => {
    if (step !== 2) { // Don't allow closing during processing
      setStep(1);
      setFormData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: '',
        phone: ''
      });
      setErrors({});
      onClose();
    }
  };

  const renderPaymentForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <DialogContent>
        {/* Payment Method Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Payment Method
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
              startIcon={<CreditCard />}
              onClick={() => setPaymentMethod('card')}
              sx={{ flex: 1 }}
            >
              Credit/Debit Card
            </Button>
            <Button
              variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
              startIcon={<Payment />}
              onClick={() => setPaymentMethod('upi')}
              sx={{ flex: 1 }}
            >
              UPI
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Payment Details Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {paymentMethod === 'card' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange('cardNumber')}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={formData.cardName}
                    onChange={handleInputChange('cardName')}
                    error={!!errors.cardName}
                    helperText={errors.cardName}
                    placeholder="John Doe"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={handleInputChange('expiryDate')}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    placeholder="MM/YY"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange('cvv')}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    placeholder="123"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}

            {paymentMethod === 'upi' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="UPI ID"
                  value={formData.upiId}
                  onChange={handleInputChange('upiId')}
                  error={!!errors.upiId}
                  helperText={errors.upiId}
                  placeholder="yourname@paytm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Payment color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="john@example.com"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+1 (555) 123-4567"
              />
            </Grid>
          </Grid>

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing}
          sx={{
            minWidth: 120,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          }}
        >
          Pay ${bookingDetails?.totalAmount?.toFixed(2) || '0.00'}
        </Button>
      </DialogActions>
    </motion.div>
  );

  const renderProcessing = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
        </motion.div>
        <Typography variant="h6" gutterBottom>
          Processing Payment...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please don't close this window. This may take a few moments.
        </Typography>
      </DialogContent>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        </motion.div>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your booking has been confirmed.
        </Typography>
        <Chip 
          label={`Transaction ID: TXN${Date.now()}`}
          color="success"
          variant="outlined"
        />
      </DialogContent>
    </motion.div>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6">
            {step === 1 ? 'Payment Details' : step === 2 ? 'Processing' : 'Success'}
          </Typography>
          {bookingDetails && (
            <Typography variant="body2" color="text.secondary">
              {bookingDetails.movieTitle} • {bookingDetails.seats?.length || 0} seat(s)
            </Typography>
          )}
        </Box>
        {step !== 2 && (
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <AnimatePresence mode="wait">
        {step === 1 && renderPaymentForm()}
        {step === 2 && renderProcessing()}
        {step === 3 && renderSuccess()}
      </AnimatePresence>
    </Dialog>
  );
};

export default PaymentModal;