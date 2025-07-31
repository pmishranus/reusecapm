const cds = require('@sap/cds');

// Initialize CAPM application
cds.on('bootstrap', (app) => {
    // Add custom middleware if needed
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
});

// Start the application
cds.run(); 