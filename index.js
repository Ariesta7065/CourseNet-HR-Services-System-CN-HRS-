require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN, // dari .env
  credentials: true
}));
app.use(express.json());

// Koneksi ke PostgreSQL pakai Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.LOG_LEVEL === 'debug' // aktifkan log kalau mode debug
  }
);

// Cek koneksi database
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Route sederhana
app.get('/', (req, res) => {
  res.json({ message: '🚀 CN-HRS Server is running!' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
