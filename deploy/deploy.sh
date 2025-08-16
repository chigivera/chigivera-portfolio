#!/bin/bash

# Neon Portfolio Deployment Script
# Run this script from the project root directory

set -e

echo "🚀 Starting Neon Portfolio deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building application..."
npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Create production environment file
echo "⚙️  Creating production environment file..."
cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Gmail Configuration for Contact Form
GMAIL_USER=ayman.benchamkha@gmail.com
GMAIL_APP_PASSWORD=xlwblcccybeodiwf

# Sanity CMS Configuration
SANITY_PROJECT_ID=lkszte6x
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Server Configuration
HOST=0.0.0.0
EOF

echo "✅ Build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo "🔧 Next steps:"
echo "   1. Copy the 'dist' folder to your Ubuntu server at 64.226.94.80"
echo "   2. Copy the 'deploy' folder to your Ubuntu server"
echo "   3. Set up environment variables on the server"
echo "   4. Configure Nginx and PM2"
