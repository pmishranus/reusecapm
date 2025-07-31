#!/bin/bash

echo "🚀 Deploying Client Details CAPM Application..."

# Navigate to client-details directory
cd client-details

# Build the MTA
echo "📦 Building MTA..."
mbt build

# Deploy to Cloud Foundry
echo "☁️ Deploying to Cloud Foundry..."
cf deploy mta_archives/client-details_1.0.0.mtar

echo "✅ Client Details application deployed successfully!"
echo "🌐 Application URL: https://client-details-srv-<space>.cfapps.sap.hana.ondemand.com"
echo "📋 Service URL: https://client-details-srv-<space>.cfapps.sap.hana.ondemand.com/client/"
echo "🔗 Consumes Employee Master Data service from separate application" 