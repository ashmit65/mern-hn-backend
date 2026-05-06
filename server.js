// backend/server.js (temporary test version)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});