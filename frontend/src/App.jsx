import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';
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

  // Initialize Lenis smooth scroll
  useLenis();

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
      background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
    }}>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          zIndex: 1000,
          originX: 0,
          scaleX
        }}
      />
      
      <LoadingScreen isVisible={isLoading} onFinish={handleLoadingFinish} />
      
      {!isLoading && (
        <>
          <Header />
          <main style={{ paddingTop: '80px' }}>
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
