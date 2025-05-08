const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  // Simple test authentication
  if (email === 'admin@shekinah.org' && password === 'admin123') {
    res.json({
      _id: '123456789',
      name: 'Admin',
      email: 'admin@shekinah.org',
      isAdmin: true,
      token: 'test-token-123456789'
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    _id: 'new-user-id',
    name,
    email,
    isAdmin: false,
    token: 'new-user-token'
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    _id: '123456789',
    name: 'Admin',
    email: 'admin@shekinah.org',
    isAdmin: true
  });
});

app.put('/api/auth/profile', (req, res) => {
  const userData = req.body;
  res.json({
    _id: '123456789',
    ...userData,
    isAdmin: true,
    token: 'test-token-123456789'
  });
});

// Ministries routes
app.get('/api/ministries', (req, res) => {
  res.json([
    {
      _id: 'ministry1',
      title: 'Worship Ministry',
      category: 'worship',
      description: 'Our worship ministry leads the congregation in praise and worship.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'John Doe',
      meetingTime: 'Saturdays at 4:00 PM'
    },
    {
      _id: 'ministry2',
      title: 'Children\'s Ministry',
      category: 'children',
      description: 'We provide a safe, fun, and Bible-based environment for children.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'Jane Smith',
      meetingTime: 'Sundays during service'
    }
  ]);
});

// Set port and start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
