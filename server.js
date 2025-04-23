const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS for all routes
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com", "www.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "unpkg.com"],
        imgSrc: ["'self'", "data:", "tile.openstreetmap.org", "a.tile.openstreetmap.org", "b.tile.openstreetmap.org", "c.tile.openstreetmap.org"],
        connectSrc: ["'self'", "firestore.googleapis.com", "www.googleapis.com"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Other security headers
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' }
  })
);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for all routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to quit');
});
