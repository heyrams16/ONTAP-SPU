const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/magic-link', require('./routes/magicLink'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/rentals', require('./routes/rentals'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ONTAP-SPU API is running' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`API accessible from network at http://10.0.0.203:${PORT}/api`);
});
