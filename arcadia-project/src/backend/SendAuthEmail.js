import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { supabase } from "../supabaseClient.js";

dotenv.config();

const app = express();
const PORT = 8000;
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middleware
app.use(cors({
  origin: '*', // Allow only the frontend origin
  methods: ['POST'],              // Allow only specific methods
}));
app.use(bodyParser.json());

// SMTP Transport Setup (replace with your email service settings)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS // App password
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  console.log('Received request body:', req.body);
  const { email, firstName, lpuID } = req.body;

  if (!email || !firstName || !lpuID) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const token = generateToken({ lpuID, email });

  const verificationLink = `http://localhost:5173/auth-complete?token=${token}`;

  const mailOptions = {
  from: "parseefan@gmail.com",
  to: email,
  subject: 'Account Verification',
  text: `Hello, ${firstName}. Verify your account here: ${verificationLink}`,
};

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.get('/verify', async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { email, lpuID } = payload;

    console.log('Verified token payload:', payload);

    // Mark the user's account as verified
    const { data, error } = await supabase
      .from('user_accounts')
      .update({ userVerifyStatus: true })
      .eq('userEmail', email)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to verify account.' });
    }

    if (!data || data.length === 0) {
      console.warn('No user found for email:', email);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate a session token (JWT) for the verified user
    const sessionToken = jwt.sign(
      { email, lpuID },
      JWT_SECRET,
      { expiresIn: '7d' } // Set token expiration
    );

    res.status(200).json({
      message: 'Account successfully verified.',
      sessionToken, // Send session token back to the frontend
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));