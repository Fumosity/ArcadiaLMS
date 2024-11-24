import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { supabase } from "../supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow only the frontend origin
  methods: ['POST'],              // Allow only specific methods
}));
app.use(bodyParser.json());

// SMTP Transport Setup (replace with your email service settings)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password
  },
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
  const { email, firstName, arcId } = req.body;

  if (!email || !firstName || !arcId) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const token = generateToken({ arcId, email });

  const verificationLink = `http://localhost:5000/verify?token=${token}`;


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
    const { email } = payload;
    console.log('Verified token payload:', payload);
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

    res.status(200).json({ message: 'Account successfully verified.' });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));