// auth.js
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const SECRET_KEY = 'your-secret-key'; // Replace with env variable in production

// Dummy user for demonstration
const mockUser = {
  id: 1,
  username: 'Admin',
  password: 'devpass123!' // Never store plain passwords in real apps!
};

// Login route – generates JWT
router.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Basic check (replace with DB lookup in real app)
  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ id: mockUser.id, username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protected route example
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, user: req.user });
});

module.exports = router;
