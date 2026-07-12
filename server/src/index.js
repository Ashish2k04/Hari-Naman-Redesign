const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration (allow requests from frontend dev server)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Serve static uploaded files (local fallback for product images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/carousel', require('./routes/carousel'));

// Check if in production to serve built frontend assets
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from React build
//   app.use(express.static(path.join(__dirname, '../../client/dist')));
  
//   // All other requests go to index.html
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
//   });
// } else {
//   app.get('/', (req, res) => {
//     res.send('Hari Naman Greens API is running...');
//   });
// }

// Simple health-check route (frontend is deployed separately on Vercel)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hari Naman Greens API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Nodemon trigger change
