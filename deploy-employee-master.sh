#!/bin/bash

echo "🚀 Deploying Employee Master Data CAPM Application..."

# Navigate to employee-master directory
cd employee-master

# Build the MTA
echo "📦 Building MTA..."
mbt build

# Deploy to Cloud Foundry
echo "☁️ Deploying to Cloud Foundry..."
cf deploy mta_archives/employee-master_1.0.0.mtar

echo "✅ Employee Master Data application deployed successfully!"
echo "🌐 Application URL: https://employee-master-srv-<space>.cfapps.sap.hana.ondemand.com"
echo "📋 Service URL: https://employee-master-srv-<space>.cfapps.sap.hana.ondemand.com/employee/" 