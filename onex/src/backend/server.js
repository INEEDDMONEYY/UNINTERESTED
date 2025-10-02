require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const User = require('./models/User');
app.use(express.json()); // To parse JSON bodies
// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Replace with your actual connection string
const cors = require('cors');

const allowedOrigin = [
  'https://glorious-space-trout-9vw7vw7pvgphxvq5-5173.app.github.dev',
  'https://uninterested.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

  // Explicitly handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});


const bodyParser = require('body-parser')
app.use(bodyParser.json()); // To parse JSON bodies
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // To parse cookies

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const routes = require('./routes')

//Controllers
//const logoutController = require('./controllers/logoutController');

//Data connection 
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

//Furture Middleware

//Sign in/ sign up routes
{/**What do they do?
They listen for HTTP POST requests to /signin and /signup.
When a POST request is made to either route (usually from a form submission), the corresponding function runs.
Right now, each handler just sends a simple text response ('Sign in route' or 'Sign up route').
They are endpoints that process incoming data (like form submissions) and respond to the client. */}

//Signin route 
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send('Invaild credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invaild credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(200).json({ message: 'Signin successful', user});
  } catch (err) {
    console.error(err);
    res.status(500).send('Signin failed');
  }
})

//Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(201).json({message: 'Signup successful', user: newUser });
    console.log('Signin request from:', req.headers.origin);

  } catch (err) {
    console.error(err);
    res.status(500).json('Signup failed');
  }
})

//Middleware for protected routes 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send('Invalid token')
  }
}

//Signout route 

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logged out');
});

//Start the server
app.get('/', (req, res) => {
  try {
    res.send(`Backend server is running on port ${port}`);
  } catch (err) {
    console.error('Error handling root route:', err);
  }
});

//Log that the serve is running
  app.listen(port, () =>  {
    console.log(`Server is running on port ${port}`);
  })
