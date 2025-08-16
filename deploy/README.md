# Neon Portfolio Deployment Guide

This guide will help you deploy your Neon Portfolio to a Digital Ocean Ubuntu machine using Nginx and PM2.

## Prerequisites

- Ubuntu 20.04+ server
- Domain name pointing to your server (ayman.bluedimension.tech)
- SSH access to your server
- Gmail account with App Password for contact form

## Step 1: Local Build

On your local machine, run the deployment script:

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

This will:
- Install dependencies
- Build the application
- Create production environment files

## Step 2: Server Setup

SSH into your Ubuntu server and run the setup script:

```bash
# Copy the deploy folder to your server first
scp -r deploy/ root@your-server-ip:/tmp/

# SSH into your server
ssh root@your-server-ip

# Run the setup script
chmod +x /tmp/deploy/server-setup.sh
/tmp/deploy/server-setup.sh
```

## Step 3: Deploy Application

Copy your built application to the server:

```bash
# From your local machine
scp -r dist/ root@your-server-ip:/var/www/neon-portfolio/
scp -r deploy/ root@your-server-ip:/var/www/neon-portfolio/
scp package*.json root@your-server-ip:/var/www/neon-portfolio/

# SSH into your server
ssh root@your-server-ip

# Navigate to application directory
cd /var/www/neon-portfolio

# Install production dependencies
npm ci --production

# Set up environment variables
nano .env.production
```

## Step 4: Configure Environment Variables

Edit `.env.production` on your server:

```bash
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Gmail Configuration for Contact Form
GMAIL_USER=ayman.benchamkha@gmail.com
GMAIL_APP_PASSWORD=your_actual_gmail_app_password

# Sanity CMS Configuration
SANITY_PROJECT_ID=lkszte6x
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Server Configuration
HOST=0.0.0.0
```

## Step 5: Start Application

Start your application with PM2:

```bash
chmod +x start-app.sh
./start-app.sh
```

## Step 6: Set Up SSL (Optional but Recommended)

Install SSL certificates with Let's Encrypt:

```bash
# Get SSL certificate
certbot --nginx -d ayman.bluedimension.tech -d www.ayman.bluedimension.tech

# Test auto-renewal
certbot renew --dry-run
```

## Step 7: Verify Deployment

Check if everything is working:

```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Check application logs
pm2 logs neon-portfolio

# Test the application
curl http://localhost:5000/health
```

## Useful Commands

### PM2 Management
```bash
pm2 status                    # Check app status
pm2 restart neon-portfolio    # Restart app
pm2 stop neon-portfolio       # Stop app
pm2 logs neon-portfolio       # View logs
pm2 monit                     # Monitor app
```

### Nginx Management
```bash
sudo nginx -t                 # Test configuration
sudo systemctl reload nginx   # Reload configuration
sudo systemctl restart nginx  # Restart Nginx
sudo systemctl status nginx   # Check status
```

### Logs
```bash
# Application logs
tail -f /var/www/neon-portfolio/logs/combined.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

## Troubleshooting

### Application won't start
1. Check logs: `pm2 logs neon-portfolio`
2. Verify environment variables: `cat .env.production`
3. Check port availability: `netstat -tlnp | grep :5000`

### Nginx issues
1. Test configuration: `nginx -t`
2. Check error logs: `tail -f /var/log/nginx/error.log`
3. Verify site configuration: `ls -la /etc/nginx/sites-enabled/`

### SSL issues
1. Check certificate validity: `certbot certificates`
2. Test renewal: `certbot renew --dry-run`
3. Verify Nginx SSL configuration

## Security Notes

- Keep your `.env.production` file secure
- Regularly update your system packages
- Monitor logs for suspicious activity
- Use strong passwords and SSH keys
- Consider setting up fail2ban for additional security

## Backup Strategy

- Backup your application files regularly
- Backup your environment configuration
- Backup your SSL certificates
- Consider automated backups with cron jobs

## Performance Optimization

- Enable Nginx gzip compression (already configured)
- Use PM2 cluster mode for multiple CPU cores
- Monitor memory usage with PM2
- Consider CDN for static assets

## Support

If you encounter issues:
1. Check the logs first
2. Verify all environment variables are set
3. Ensure all services are running
4. Check firewall and port configurations
