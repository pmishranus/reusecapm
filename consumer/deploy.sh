#!/bin/bash

echo "Setting up Consumer Application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npx cds build

# Deploy to HANA (if HANA is available)
echo "Deploying to HANA..."
npx cds deploy --to hana:consumer-db

echo "Consumer application setup complete!"
echo ""
echo "To start the application:"
echo "npm start"
echo ""
echo "To test the application:"
echo "Use the test.http file in this directory"
echo ""
echo "Make sure the employee application is running on http://localhost:4004/employee" 