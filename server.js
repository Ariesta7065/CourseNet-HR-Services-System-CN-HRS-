const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); // koneksi database

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // biar fleksibel
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running and database is connected!');
});

// Sync Database (optional: create tables automatically if needed)
sequelize.sync({ alter: false })
  .then(() => console.log('✅ Database synced successfully.'))
  .catch(err => console.error('❌ Database sync failed:', err));

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
