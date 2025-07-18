// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { fetchShow } from '../api/shows';
// import { 
//   Typography, 
//   Paper, 
//   Button, 
//   Box, 
//   Alert, 
//   CircularProgress,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Container,
//   Card,
//   CardContent,
//   TextField,
//   InputAdornment,
//   Grid
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useAuth } from '../context/AuthContext';
// import { CreditCard, Security, Event, AccessTime, Chair } from '@mui/icons-material';

// const BookingContainer = styled(Container)(({ theme }) => ({
//   minHeight: '100vh',
//   padding: theme.spacing(4, 2),
//   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
//   position: 'relative',
//   overflow: 'hidden',
  
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
//     animation: 'float 20s ease-in-out infinite',
//   },
  
//   '@keyframes float': {
//     '0%, 100%': { transform: 'translateY(0px)' },
//     '50%': { transform: 'translateY(-20px)' }
//   }
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   background: 'rgba(255, 255, 255, 0.1)',
//   backdropFilter: 'blur(20px)',
//   border: '1px solid rgba(255, 255, 255, 0.2)',
//   borderRadius: '25px',
//   color: 'white',
//   boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
//   position: 'relative',
//   overflow: 'hidden',
  
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: '-100%',
//     width: '100%',
//     height: '100%',
//     background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
//     transition: 'left 0.5s',
//   },
  
//   '&:hover::before': {
//     left: '100%',
//   }
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   '& .MuiOutlinedInput-root': {
//     background: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: '15px',
//     color: 'white',
//     backdropFilter: 'blur(10px)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
    
//     '& fieldset': {
//       border: 'none',
//     },
    
//     '&:hover': {
//       background: 'rgba(255, 255, 255, 0.15)',
//       transform: 'translateY(-2px)',
//       boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
//     },
    
//     '&.Mui-focused': {
//       background: 'rgba(255, 255, 255, 0.2)',
//       transform: 'translateY(-2px)',
//       boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
//     }
//   },
  
//   '& .MuiInputLabel-root': {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: 500,
    
//     '&.Mui-focused': {
//       color: 'white',
//     }
//   },
  
//   '& .MuiOutlinedInput-input': {
//     color: 'white',
//     fontWeight: 500,
    
//     '&::placeholder': {
//       color: 'rgba(255, 255, 255, 0.6)',
//     }
//   },
  
//   '& .MuiFormHelperText-root': {
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontWeight: 500
//   }
// }));

// const ActionButton = styled(Button)(({ theme, variant }) => ({
//   borderRadius: '15px',
//   padding: theme.spacing(1.5, 4),
//   fontWeight: 700,
//   fontSize: '1.1rem',
//   textTransform: 'none',
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   position: 'relative',
//   overflow: 'hidden',
  
//   ...(variant === 'primary' && {
//     background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
//     color: 'white',
//     border: 'none',
//     boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
    
//     '&:hover': {
//       background: 'linear-gradient(135deg, #45b7aa 0%, #3d8b73 100%)',
//       transform: 'translateY(-3px)',
//       boxShadow: '0 12px 35px rgba(78, 205, 196, 0.4)',
//     },
    
//     '&:disabled': {
//       background: 'rgba(255, 255, 255, 0.1)',
//       color: 'rgba(255, 255, 255, 0.5)',
//       transform: 'none',
//       boxShadow: 'none',
//     }
//   }),
  
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: '-100%',
//     width: '100%',
//     height: '100%',
//     background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
//     transition: 'left 0.5s',
//   },
  
//   '&:hover::before': {
//     left: '100%',
//   }
// }));

// const BookingForm = () => {
//   const { showId } = useParams();
//   const navigate = useNavigate();
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [cvv, setCvv] = useState('');
//   const [cvvError, setCvvError] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [expiryError, setExpiryError] = useState('');
//   const [cardNumber, setCardNumber] = useState('');
//   const [cardNumberError, setCardNumberError] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('');
//   const { token } = useAuth();

//   useEffect(() => {
//     if (!token) {
//       navigate('/signin');
//     }
//   }, [token, navigate]);

//   const { data: show, isLoading, isError } = useQuery({
//     queryKey: ['show', showId],
//     queryFn: () => fetchShow(showId),
//   });

//   useEffect(() => {
//     // Get booking details from URL params or localStorage
//     const params = new URLSearchParams(window.location.search);
//     const seats = params.get('seats');
//     const showTime = params.get('showTime');
    
//     if (seats && showTime) {
//       setBookingDetails({
//         seats: seats.split(',').map(s => parseInt(s)),
//         showTime: showTime,
//         totalPrice: seats.split(',').length * 10
//       });
//     }
//   }, []);

//   const handleCVVChange = (e) => {
//     let value = e.target.value.replace(/\D/g, '');
//     if (value.length > 4) value = value.slice(0, 4);
    
//     setCvv(value);
    
//     // Clear error when input is empty
//     if (!value) {
//       setCvvError('');
//       return;
//     }
    
//     // Validate CVV
//     const isValid = validateCVV(value);
//     setCvvError(isValid ? '' : 'Please enter a valid CVV (3-4 digits)');
//   };

//   const handleExpiryChange = (e) => {
//     let value = e.target.value;
    
//     // Allow only digits and slash
//     value = value.replace(/[^\d/]/g, '');
    
//     // Auto-insert slash after MM
//     if (value.length === 2 && !value.includes('/')) {
//       value = value + '/';
//     }
    
//     // Limit to MM/YY format
//     if (value.length > 5) return;
    
//     setExpiry(value);
    
//     // Clear error when input is empty
//     if (!value.trim()) {
//       setExpiryError('');
//       return;
//     }
    
//     // Validate format and date
//     const isValid = validateExpiry(value);
//     setExpiryError(isValid ? '' : 'Please enter a valid expiry date (MM/YY)');
//   };

//   const handleCardNumberChange = (e) => {
//     let value = e.target.value;
    
//     // Allow only digits and spaces
//     value = value.replace(/[^\d\s]/g, '');
    
//     // Limit to 16 digits with optional spaces
//     if (value.length > 19) return;
    
//     setCardNumber(value);
    
//     // Clear error when input is empty
//     if (!value.trim()) {
//       setCardNumberError('');
//       return;
//     }
    
//     // Validate card number
//     const isValid = validateCardNumber(value);
//     setCardNumberError(isValid ? '' : 'Please enter a valid card number');
//   };

//   const handlePayment = async () => {
//     setIsProcessing(true);
//     setError('');
    
//     try {
//       // Prepare booking data
//       const bookingData = {
//         showId: show._id,
//         movieId: show.movie._id,
//         theaterId: show.theater._id,
//         showTime: bookingDetails.showTime,
//         seats: bookingDetails.seats,
//         totalAmount: bookingDetails.totalPrice,
//         paymentMethod: 'card',
//         cardLast4: cardNumber.slice(-4).replace(/\s/g, '')
//       };
      
//       // Make API call to create booking
//       const response = await fetch('https://movieticketbookingsystem-7suc.onrender.com/api/bookings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(bookingData)
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to process booking');
//       }
      
//       // Handle successful payment
//       const result = await response.json();
//       setPaymentStatus('succeeded');
//       onPaymentSuccess(result);
      
//     } catch (error) {
//       console.error('Payment failed:', error);
//       setPaymentStatus('failed');
//       setError(error.message || 'Payment failed. Please try again.');
      
//       // Scroll to error message
//       setTimeout(() => {
//         const errorElement = document.getElementById('payment-error');
//         if (errorElement) {
//           errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 100);
      
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const validateCVV = (value) => {
//     return value.length >= 3 && value.length <= 4;
//   };

//   const validateExpiry = (value) => {
//     const parts = value.split('/');
//     if (parts.length !== 2) return false;
//     const month = parseInt(parts[0]);
//     const year = parseInt(parts[1]);
//     return month >= 1 && month <= 12 && year >= 22;
//   };

//   const validateCardNumber = (value) => {
//     // Accepts 16 digits with optional spaces or hyphens after every 4 digits
//     const regex = /^(\d{4}[\s-]?){3}\d{4}$/;
//     return regex.test(value);
//   };

//   if (isLoading) {
//     return (
//       <BookingContainer maxWidth={false}>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6 }}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '60vh',
//           }}
//         >
//           <motion.div
//             animate={{ 
//               rotate: 360,
//               scale: [1, 1.2, 1]
//             }}
//             transition={{ 
//               rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//               scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
//             }}
//           >
//             <CircularProgress 
//               size={80} 
//               sx={{ 
//                 color: 'white',
//                 filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
//                 mb: 3
//               }} 
//             />
//           </motion.div>
//           <Typography 
//             variant="h5" 
//             sx={{ 
//               color: 'white',
//               fontWeight: 600,
//               textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
//             }}
//           >
//             Loading booking details...
//           </Typography>
//         </motion.div>
//       </BookingContainer>
//     );
//   }
  
//   if (isError || !show) {
//     return (
//       <BookingContainer maxWidth={false}>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
//         >
//           <StyledCard sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
//             <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'white' }}>
//               ⚠️ Show Not Found
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
//               We couldn't find the show you're looking for. Please try again.
//             </Typography>
//             <ActionButton 
//               variant="primary"
//               onClick={() => navigate('/movies')}
//             >
//               Browse Movies
//             </ActionButton>
//           </StyledCard>
//         </motion.div>
//       </BookingContainer>
//     );
//   }

//   if (!bookingDetails) {
//     return (
//       <BookingContainer maxWidth={false}>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
//         >
//           <StyledCard sx={{ p: 5, maxWidth: 500, textAlign: 'center' }}>
//             <motion.div
//               animate={{ 
//                 rotate: [0, 5, -5, 0],
//                 scale: [1, 1.1, 1]
//               }}
//               transition={{ 
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             >
//               <Chair sx={{ fontSize: 60, mb: 3, color: 'white' }} />
//             </motion.div>
//             <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'white' }}>
//               🎫 No Booking Details
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
//               No booking details found. Please go back and select your seats to continue with the booking.
//             </Typography>
//             <ActionButton 
//               variant="primary"
//               onClick={() => navigate(`/movies/${showId}`)}
//               startIcon={<Chair />}
//             >
//               Select Seats
//             </ActionButton>
//           </StyledCard>
//         </motion.div>
//       </BookingContainer>
//     );
//   }

//   return (
//     <BookingContainer maxWidth={false}>
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <Box sx={{ maxWidth: 800, mx: 'auto' }}>
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <Box sx={{ textAlign: 'center', mb: 6 }}>
//               <Typography
//                 variant="h3"
//                 sx={{
//                   fontWeight: 700,
//                   color: 'white',
//                   textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
//                   mb: 2,
//                   fontSize: { xs: '2rem', md: '3rem' }
//                 }}
//               >
//                 🎬 Complete Your Booking
//               </Typography>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   color: 'rgba(255, 255, 255, 0.9)',
//                   fontWeight: 400,
//                   maxWidth: 600,
//                   mx: 'auto'
//                 }}
//               >
//                 Just a few more steps to secure your movie experience
//               </Typography>
//             </Box>
//           </motion.div>

//           <Grid container spacing={4}>
//             {/* Booking Summary */}
//             <Grid item xs={12} md={6}>
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//               >
//                 <StyledCard>
//                   <CardContent sx={{ p: 4 }}>
//                     <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Event /> Booking Summary
//                     </Typography>
                    
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="h6" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
//                         {show.title}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
//                         {show.description}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', p: 3, mb: 3 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                         <AccessTime sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />
//                         <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
//                           Show Time: {bookingDetails.showTime}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                         <Chair sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.8)' }} />
//                         <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
//                           Seats: {bookingDetails.seats.join(', ')}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
//                         <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
//                           <span>Total Amount:</span>
//                           <span>${bookingDetails.totalPrice}</span>
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </CardContent>
//                 </StyledCard>
//               </motion.div>
//             </Grid>

//             {/* Payment Form */}
//             <Grid item xs={12} md={6}>
//               <motion.div
//                 initial={{ opacity: 0, x: 30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.6 }}
//               >
//                 <StyledCard>
//                   <CardContent sx={{ p: 4 }}>
//                     <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <CreditCard /> Payment Details
//                     </Typography>

//                     {/* Error Alert */}
//                     <AnimatePresence>
//                       {error && (
//                         <motion.div
//                           initial={{ opacity: 0, y: -20, scale: 0.9 }}
//                           animate={{ opacity: 1, y: 0, scale: 1 }}
//                           exit={{ opacity: 0, y: -20, scale: 0.9 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <Alert 
//                             severity="error" 
//                             sx={{ 
//                               mb: 3,
//                               borderRadius: '15px',
//                               background: 'rgba(255, 107, 107, 0.1)',
//                               color: 'white',
//                               border: '1px solid rgba(255, 107, 107, 0.3)',
//                               backdropFilter: 'blur(10px)',
//                               '& .MuiAlert-icon': {
//                                 color: '#ff6b6b'
//                               }
//                             }}
//                           >
//                             {error}
//                           </Alert>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {paymentStatus && (
//                       <motion.div
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5 }}
//                       >
//                         <Alert 
//                           severity="success"
//                           sx={{ 
//                             mb: 3,
//                             borderRadius: '15px',
//                             background: 'rgba(76, 175, 80, 0.1)',
//                             color: 'white',
//                             border: '1px solid rgba(76, 175, 80, 0.3)',
//                             backdropFilter: 'blur(10px)',
//                             '& .MuiAlert-icon': {
//                               color: '#4caf50'
//                             }
//                           }}
//                         >
//                           {paymentStatus}
//                         </Alert>
//                       </motion.div>
//                     )}

//                     <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           <ListItemText 
//             primary="Selected Seats" 
//             secondary={bookingDetails.seats.join(', ')}
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Number of Seats" 
//             secondary={bookingDetails.seats.length}
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Price per Seat" 
//             secondary="$10"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Total Amount" 
//             secondary={`$${bookingDetails.totalPrice}`}
//             sx={{ 
//               '& .MuiListItemText-primary': { 
//                 fontWeight: 'bold',
//                 fontSize: '1.1rem'
//               },
//               '& .MuiListItemText-secondary': { 
//                 fontWeight: 'bold',
//                 fontSize: '1.2rem',
//                 color: 'primary.main'
//               }
//             }}
//           />
//         </ListItem>
//       </List>

//       <Divider sx={{ my: 2 }} />

//       <Alert severity="success" sx={{ mb: 3 }}>
//         Your booking has been confirmed! You will receive a confirmation email shortly.
//       </Alert>

//       <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
//         <Button 
//           variant="contained" 
//           onClick={() => navigate('/my-bookings')}
//           sx={{ minWidth: 120 }}
//         >
//           View My Bookings
//         </Button>
//         <Button 
//           variant="outlined" 
//           onClick={() => navigate('/')}
//           sx={{ minWidth: 120 }}
//         >
//           Back to Shows
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default BookingForm; 