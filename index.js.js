// index.js

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Sample user data (you'll replace this with your own authentication logic)
const users = [
  {
    id: 1,
    username: 'Moein Ranjbar',
    password: 'password123'
  },
  {
    id: 2,
    username: 'Mohammad Vafadar',
    password: 'password456'
  }
];

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to generate JWT token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // User found, generate JWT token
    const token = jwt.sign({ id: user.id }, 'your_secret_key');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected endpoint
app.get('/api/resume', verifyToken, (req, res) => {
  // Verify token
  jwt.verify(req.token, 'your_secret_key', (err, authData) => {
    if (err) {
      res.sendStatus(401); // Send 401 for Unauthorized
    } else {
      // Send the resume data
      res.json({ 
        name: 'John Doe',
        title: 'Software Developer',
        experience: '5 years of experience in Node.js and Express.js'
      });
    }
  });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    // Return 401 if token is missing
    res.sendStatus(401);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
