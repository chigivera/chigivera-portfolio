#!/bin/bash

# Start Neon Portfolio Application with PM2
# Run this script from the application directory

set -e

echo "🚀 Starting Neon Portfolio application..."

# Check if we're in the right directory
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: dist/index.js not found. Please run this script from the application directory."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ Error: PM2 is not installed. Please install it first: npm install -g pm2"
    exit 1
fi

# Stop existing PM2 processes
echo "🛑 Stopping existing PM2 processes..."
pm2 stop neon-portfolio 2>/dev/null || true
pm2 delete neon-portfolio 2>/dev/null || true

# Start the application
echo "▶️  Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Set PM2 to start on boot
echo "🔧 Setting PM2 to start on boot..."
pm2 startup

echo "✅ Application started successfully!"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs neon-portfolio"
echo "🌐 Your application should now be running on port 5000"
echo "🔗 Access it through your domain: ayman.bluedimension.tech"
