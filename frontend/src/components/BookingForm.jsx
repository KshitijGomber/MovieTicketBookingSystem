import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!token) {
      setError('You must be signed in to book.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createBooking({ showId, seat });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/my-bookings'), 1200);
    } catch (err) {
      setError('Booking failed.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Book Your Seat
      </Typography>
      {/* Booking form will go here */}
    </div>
  );
};

export default BookingForm; 