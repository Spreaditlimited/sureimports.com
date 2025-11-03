// emailConfig.ts
import nodemailer from 'nodemailer';

const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

// Try port 587 with STARTTLS (more reliable than port 465)
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
  requireTLS: true, // Require TLS
  pool: true, // Use pooled connections
  maxConnections: 5, // Maximum number of simultaneous connections
  maxMessages: 100, // Maximum number of messages per connection
  rateDelta: 1000, // Time between messages in milliseconds
  rateLimit: 5, // Maximum number of messages per rateDelta
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
  logger: false, // Set to true for debugging
  debug: false, // Set to true for debugging
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    minVersion: 'TLSv1.2',
    ciphers: 'SSLv3',
  },
});

// Alternative: Port 465 with SSL (uncomment if port 587 doesn't work)
// const transporter = nodemailer.createTransport({
//   host: 'smtp.hostinger.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: SMTP_EMAIL,
//     pass: SMTP_PASSWORD,
//   },
//   pool: true,
//   maxConnections: 5,
//   connectionTimeout: 60000,
//   greetingTimeout: 30000,
//   socketTimeout: 60000,
//   tls: {
//     rejectUnauthorized: false,
//     minVersion: 'TLSv1.2',
//   },
// });

// Verify connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// const transporter = nodemailer.createTransport({
//   host: 'smtp.sureimports.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: "hello@sureimports.com",
//     pass: "nofzu2-purquj-hevseQ",
//   },
//   connectionTimeout: 60000, // 60 seconds
// });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.sureimports.com',
//   port: 587,
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: "hello@sureimports.com",
//     pass: "nofzu2-purquj-hevseQ",
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.titan.email',
//   port: 465,
//   secure: true, // Use SSL/TLS
//   auth: {
//     user: "hello@sureimports.com",
//     pass: "nofzu2-purquj-hevseQ",
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.sureimports.com', // e.g., smtp.yourdomain.com
//   port: 465, // Common ports: 587 (STARTTLS), 465 (SSL/TLS), 25 (non-secure, often blocked)
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "hello@sureimports.com", // Your SMTP username
//     pass: "nofzu2-purquj-hevseQ", // Your SMTP password
//   },
// });

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: SMTP_EMAIL,
//     pass: SMTP_PASSWORD,
//   },
// });

export default transporter;
