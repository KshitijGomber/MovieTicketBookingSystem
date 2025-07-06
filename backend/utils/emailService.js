const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error('Error with mailer configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

/**
 * Send a password reset email
 * @param {string} to - Recipient email address
 * @param {string} token - Password reset token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"Movie Ticket Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send a booking confirmation email
 * @param {Object} options - Booking details
 * @param {string} options.to - Recipient email
 * @param {string} options.movieName - Name of the movie
 * @param {string} options.showTime - Show time
 * @param {Array} options.seats - Array of booked seats
 * @param {number} options.totalAmount - Total amount paid
 * @param {string} options.bookingId - Booking reference ID
 * @param {string} options.theatreName - Theatre name
 * @param {string} options.paymentId - Payment ID
 * @returns {Promise}
 */
const sendBookingConfirmationEmail = async ({ to, movieName, showTime, seats, totalAmount, bookingId, theatreName = 'Cineplex', paymentId }) => {
  // Calculate subtotal and tax (10% of subtotal)
  const subtotal = totalAmount / 1.1; // Reverse calculate subtotal from total (which includes 10% tax)
  const tax = totalAmount - subtotal;
  
  // Format the show time for display
  const showDate = showTime ? new Date(showTime) : new Date();
  const formattedTime = showDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Movie Ticket Booking'}" <${process.env.SMTP_USER}>`,
    to,
    subject: `🎟️ Booking Confirmed - ${bookingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="color: #2c3e50; margin-bottom: 5px;">Booking Confirmed!</h1>
          <p style="color: #7f8c8d; margin-top: 0;">${formattedTime}</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin: 20px 0;">
          <h2 style="color: #2c3e50; margin-top: 0;">${movieName}</h2>
          <div style="display: flex; justify-content: space-between; margin: 20px 0; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <div>
              <p style="color: #7f8c8d; margin: 5px 0;">Theatre</p>
              <p style="margin: 5px 0; font-weight: 500;">${theatreName}</p>
            </div>
            <div>
              <p style="color: #7f8c8d; margin: 5px 0;">Date & Time</p>
              <p style="margin: 5px 0; font-weight: 500;">${formattedTime}</p>
            </div>
          </div>
          
          <div style="margin: 20px 0; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <p style="color: #7f8c8d; margin: 5px 0 10px 0;">Seats</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${seats.map(seat => `<span style="background: #e8f4fd; color: #1976d2; padding: 5px 10px; border-radius: 4px; display: inline-block;">${seat}</span>`).join('')}
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Tax (10%)</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 1.1em;">
              <span>Total Amount</span>
              <span>$${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="background: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: 500;">Payment Status: <span style="color: #388e3c;">Paid Successfully</span></p>
            <p style="margin: 5px 0 0 0; font-size: 0.9em;">Transaction ID: ${paymentId || 'N/A'}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.9em;">Booking Reference: ${bookingId}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #7f8c8d; font-size: 0.9em;">
            Please show this email at the theatre ticket counter to collect your physical tickets.
            We recommend arriving at least 30 minutes before the showtime.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.9em;">
          <p>If you have any questions, please contact our support team at support@movietickets.com</p>
          <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Movie Ticket Booking'}. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send a booking cancellation email
 * @param {Object} options - Booking details
 * @param {string} options.to - Recipient email
 * @param {string} options.movieName - Name of the movie
 * @param {string} options.bookingId - Booking reference ID
 * @param {number} options.refundAmount - Amount to be refunded (in USD)
 * @param {string} [options.showTime] - Show time (optional)
 * @returns {Promise}
 */
const sendBookingCancellationEmail = async ({ to, movieName, bookingId, refundAmount, showTime }) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Movie Ticket Booking'}" <${process.env.SMTP_USER}>`,
    to,
    subject: `❌ Booking Cancelled - ${bookingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #fff5f5; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="color: #c62828; margin-bottom: 5px;">Booking Cancelled</h1>
          <p style="color: #e57373; margin-top: 0;">Your booking has been successfully cancelled</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin: 20px 0;">
          <h2 style="color: #2c3e50; margin-top: 0;">${movieName}</h2>
          <p style="color: #7f8c8d;">Booking Reference: <strong>${bookingId}</strong></p>
          
          <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f57c00; margin-top: 0;">Refund Details</h3>
            <p>Amount to be refunded: <strong>$${(refundAmount || 0).toFixed(2)} USD</strong></p>
            ${showTime ? `
            <p style="margin: 10px 0 5px 0;">
              <strong>Show Time:</strong> ${new Date(showTime).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>` : ''}
            <p style="font-size: 0.9em; color: #7f8c8d; margin-top: 15px;">
              The refund will be processed to your original payment method within 5-7 business days.
              You will receive a confirmation email once the refund has been processed.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <p>We're sorry to see you go. Hope to see you again soon!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="display: inline-block; background: #1976d2; color: white; 
                      padding: 10px 25px; text-decoration: none; border-radius: 4px; 
                      margin-top: 15px; font-weight: 500;">
              Book Another Movie
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.9em;">
          <p>If you didn't request this cancellation, please contact our support team immediately.</p>
          <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Movie Ticket Booking'}. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  transporter
};
