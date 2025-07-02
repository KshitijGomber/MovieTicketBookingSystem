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
 * @returns {Promise}
 */
const sendBookingConfirmationEmail = async ({ to, movieName, showTime, seats, totalAmount, bookingId }) => {
  const mailOptions = {
    from: `"Movie Ticket Booking" <${process.env.SMTP_USER}>`,
    to,
    subject: `Booking Confirmation - ${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎬 Booking Confirmed!</h2>
        <p>Thank you for booking with us. Here are your booking details:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${movieName}</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Show Time:</strong> ${new Date(showTime).toLocaleString()}</p>
          <p><strong>Seats:</strong> ${seats.join(', ')}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        </div>
        
        <p>Please arrive at least 30 minutes before the showtime.</p>
        <p>Show this email at the ticket counter to collect your tickets.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
          <p>If you have any questions, please contact our support team.</p>
          <p>Enjoy your movie!</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  transporter
};
