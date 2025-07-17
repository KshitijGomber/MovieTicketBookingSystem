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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100 text-gray-800">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <LoadingScreen isVisible={isLoading} onFinish={handleLoadingFinish} />
      
      {/* Floating elements - Always visible on main site */}
      {!isLoading && (
        <div className="fixed bottom-4 right-4 z-30 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
          <motion.img 
            src="/logo.png" 
            alt="BookYourMovie Logo" 
            className="w-full h-full object-contain hover:scale-110 transition-transform duration-300 bg-transparent pointer-events-none"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      )}
      
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
