const cds = require('@sap/cds');
const express = require('express');
const path = require('path');

// Initialize CAPM application
cds.on('bootstrap', (app) => {
  // Add custom middleware if needed
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Serve static files from the app directory
  app.use('/app', express.static(path.join(__dirname, 'app')));
  
  // Serve the dashboard at the root
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
  });

  // Add a simple health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'client-details',
      timestamp: new Date().toISOString()
    });
  });
});

// Start the application
cds.run(); 