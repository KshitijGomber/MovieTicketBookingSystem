require('dotenv').config();
const { sendBookingConfirmationEmail } = require('../utils/emailService');

const testEmailData = {
  to: 'test@example.com', // Replace with your test email
  movieName: 'Inception',
  showTime: new Date('2025-07-15T19:00:00Z'), // Tomorrow at 7 PM
  seats: ['A1', 'A2'],
  totalAmount: 25.98,
  bookingId: 'BK' + Date.now(),
  theatreName: 'Cineplex Downtown',
  paymentId: 'PAY' + Date.now()
};

const testEmail = async () => {
  try {
    console.log('Testing email functionality...');
    console.log('Email configuration:');
    console.log('- SMTP Host:', process.env.SMTP_HOST);
    console.log('- SMTP User:', process.env.SMTP_USER);
    console.log('- SMTP Port:', process.env.SMTP_PORT);
    console.log('');

    console.log('Sending test booking confirmation email...');
    const result = await sendBookingConfirmationEmail(testEmailData);
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check SMTP credentials.');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed. Check SMTP host and port.');
    }
  }
};

testEmail();
