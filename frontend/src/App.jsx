import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import './App.css';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import MyBookings from './components/MyBookings';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './context/AuthContext';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import HomePage from './pages/HomePage';
import MovieListPage from './pages/MovieListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import { useLenis } from './hooks/useLenis';

// Redirect component for legacy URLs
const ShowRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/movies/${id}`} replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useMuiTheme();

  // Initialize Lenis smooth scroll
  useLenis();

  // Safety timeout to ensure loading screen doesn't get stuck
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Max 1.5 seconds loading time

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  // Scroll progress bar logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2a2a2a 100%)'
        : 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 40%, #e8e8e8 100%)',
      color: theme.palette.text.primary,
      transition: 'all 0.3s ease'
    }}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <LoadingScreen isVisible={isLoading} onFinish={handleLoadingFinish} />
      
      {!isLoading && (
        <>
          <Header />
          <main>
            <Routes>
              {/* New Page Structure */}
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MovieListPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              
              {/* Legacy routes - redirect to new structure */}
              <Route path="/shows" element={<Navigate to="/movies" replace />} />
              <Route path="/shows/:id" element={<ShowRedirect />} />
              <Route path="/show/:id" element={<ShowRedirect />} />
              
              {/* Booking Flow */}
              <Route path="/book/:showId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />
              
              <Route path="/booking-confirmation/:bookingId" element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } />
              
              {/* Authentication Routes */}
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Legacy Components (for backward compatibility) */}
              <Route path="/show-details/:id" element={<ShowDetails />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
