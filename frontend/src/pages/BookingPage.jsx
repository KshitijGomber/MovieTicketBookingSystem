import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { Box, Typography, Container, Stepper, Step, StepLabel, Paper, CircularProgress, Alert } from '@mui/material';
import SeatSelection from '../components/SeatSelection';
import PaymentForm from '../components/PaymentForm';

const steps = ['Select Seats', 'Payment', 'Confirmation'];

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Fetch show details
  const { data: show, isLoading, isError, error } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
    enabled: !!showId,
  });

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    setActiveStep(1);
  };

  const handlePaymentSuccess = (booking) => {
    setBookingData(booking);
    setActiveStep(2);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    navigate('/my-bookings');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SeatSelection
            showId={showId}
            showTime={showTime}
            onSeatsSelected={handleSeatSelection}
          />
        );
      case 1:
        return (
          <PaymentForm
            showId={showId}
            showTime={showTime}
            seats={selectedSeats}
            amount={selectedSeats.length * 10} // $10 per seat
            onBack={handleBack}
            onSuccess={handlePaymentSuccess}
          />
        );
      case 2:
        return (
          <BookingConfirmation
            bookingId={bookingData?._id}
            onComplete={handleComplete}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error.message || 'Failed to load show details'}
      </Alert>
    );
  }

  if (!show) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        Show not found
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {show.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {show.theatre} • {show.language} • {show.duration} min
      </Typography>

      <Box sx={{ width: '100%', my: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mt: 2 }}>
        {renderStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default BookingPage;
