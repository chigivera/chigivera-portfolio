#!/bin/bash

# Ubuntu Server Setup Script for Neon Portfolio
# Run this script on your Ubuntu server as root

set -e

echo "🚀 Setting up Ubuntu server for Neon Portfolio..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "📥 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo "📥 Installing PM2..."
npm install -g pm2

# Install Nginx (if not already installed)
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    apt install -y nginx
fi

# Install Certbot for SSL
echo "📥 Installing Certbot for SSL certificates..."
apt install -y certbot python3-certbot-nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/neon-portfolio
chown -R $SUDO_USER:$SUDO_USER /var/www/neon-portfolio

# Create logs directory
mkdir -p /var/www/neon-portfolio/logs
chown -R $SUDO_USER:$SUDO_USER /var/www/neon-portfolio/logs

# Copy Nginx configuration
echo "⚙️  Setting up Nginx configuration..."
cp nginx-site.conf /etc/nginx/sites-available/neon-portfolio
ln -sf /etc/nginx/sites-available/neon-portfolio /etc/nginx/sites-enabled/

# Remove default Nginx site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

# Set up firewall
echo "🔥 Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "✅ Server setup completed!"
echo "🔧 Next steps:"
echo "   1. Copy your application files to /var/www/neon-portfolio"
echo "   2. Set up environment variables"
echo "   3. Install application dependencies"
echo "   4. Start the application with PM2"
echo "   5. Set up SSL certificates with Certbot"
