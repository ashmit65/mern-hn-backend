require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { scrapeHackerNews } = require('./services/hnScraper');
const cron = require('node-cron');

const app = express();

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await scrapeHackerNews();

    // Schedule scraping every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      console.log('Running scheduled scrape...');
      scrapeHackerNews();
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
};

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

startServer();
