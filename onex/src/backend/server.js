const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const User = require('./models/User');
app.use(express.json()); // To parse JSON bodies
// MongoDB connection
const mongoURI = 'mongodb+srv://FT_Admin:<MysteryMansion.1>@mm1.vcpson3.mongodb.net/?retryWrites=true&w=majority&appName=MM1'; // Replace with your actual connection string
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes
//const bodyParser = require('body-parser')
//const routes = require('./routes')

app.get('/', (req, res) => {
    //Try catch block to handle any errors
  try {
    res.send(`Backend server is running on port ${port}`)
  }catch (err) {
    console.error('Error handling root route:', err)
  }
})

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

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    if (user.password !== password) { // In production, use bcrypt to compare hashed passwords
      return res.status(401).send('Invalid username or password');
    }
    res.send('Sign in successful');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/signup', (req, res) => {
  //Handle sign up logic here
  res.send('Sign up route')
})

//Profile route
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  //Fetch user profile logic here
  res.send(`User profile for user with ID: ${id}`)
})

//Other routes

//Use routes
//app.use('/api', routes)

//Start the server

//Log that the serve is running
  app.listen(port, () =>  {
    console.log(`Server is running on port ${port}`);
  })
